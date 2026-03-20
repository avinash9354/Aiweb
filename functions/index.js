const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

// ── Middleware: Verify Firebase ID Token ────────────────────────────────────
const verifyToken = async (req, res) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  try {
    const token = authHeader.split("Bearer ")[1];
    return await admin.auth().verifyIdToken(token);
  } catch {
    res.status(401).json({ error: "Invalid token" });
    return null;
  }
};

// ── Helper: CORS headers ────────────────────────────────────────────────────
const setCors = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Authorization,Content-Type");
  if (req.method === "OPTIONS") { res.status(204).send(""); return true; }
  return false;
};

// ── 1. GENERATE RESUME (OpenAI) ─────────────────────────────────────────────
exports.generateResume = functions
  .region("us-central1")
  .runWith({ timeoutSeconds: 60, memory: "256MB" })
  .https.onRequest(async (req, res) => {
    if (setCors(req, res)) return;
    if (req.method !== "POST") { res.status(405).send("Method Not Allowed"); return; }

    const decoded = await verifyToken(req, res);
    if (!decoded) return;

    const { formData, isPaid } = req.body;
    if (!formData || !formData.name) {
      res.status(400).json({ error: "Missing form data" });
      return;
    }

    // Sanitize inputs
    const sanitize = (s) => (typeof s === "string" ? s.replace(/<[^>]*>/g, "").trim().slice(0, 2000) : "");

    const name = sanitize(formData.name);
    const skills = sanitize(formData.skills);
    const experience = sanitize(formData.experience);
    const education = sanitize(formData.education);
    const summary = sanitize(formData.summary);
    const jobTitle = sanitize(formData.jobTitle);

    const maxTokens = isPaid ? 1200 : 350;

    const prompt = `Write a professional, ATS-optimized resume for the following person.
${!isPaid ? "Generate only a brief 3-section summary (Professional Summary, Skills, One Highlight)." : "Generate a complete resume with all sections: Professional Summary, Skills, Work Experience, Education, and Achievements."}

Name: ${name}
Job Title: ${jobTitle || "Professional"}
Summary: ${summary}
Skills: ${skills}
Experience: ${experience}
Education: ${education}

Format it cleanly using markdown with section headers (##). Be professional, quantify achievements where possible. Do NOT add any placeholder text.`;

    try {
      const OPENAI_API_KEY = functions.config().openai.key;
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an expert resume writer with 10 years experience writing ATS-optimized resumes for tech professionals." },
            { role: "user", content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const resume = response.data.choices[0].message.content;
      res.status(200).json({ resume, isPaid });
    } catch (err) {
      console.error("OpenAI error:", err.response?.data || err.message);
      res.status(500).json({ error: "AI generation failed. Please try again." });
    }
  });

// ── 2. CREATE RAZORPAY ORDER ────────────────────────────────────────────────
exports.createOrder = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {
    if (setCors(req, res)) return;
    if (req.method !== "POST") { res.status(405).send("Method Not Allowed"); return; }

    const decoded = await verifyToken(req, res);
    if (!decoded) return;

    const { amount } = req.body;
    if (!amount || amount < 1) {
      res.status(400).json({ error: "Invalid amount" });
      return;
    }

    try {
      const RAZORPAY_KEY_ID = functions.config().razorpay.key_id;
      const RAZORPAY_KEY_SECRET = functions.config().razorpay.key_secret;

      const response = await axios.post(
        "https://api.razorpay.com/v1/orders",
        { amount: amount * 100, currency: "INR", receipt: `rcpt_${Date.now()}` },
        {
          auth: { username: RAZORPAY_KEY_ID, password: RAZORPAY_KEY_SECRET },
          headers: { "Content-Type": "application/json" },
        }
      );

      res.status(200).json({ orderId: response.data.id });
    } catch (err) {
      console.error("Razorpay error:", err.response?.data || err.message);
      res.status(500).json({ error: "Order creation failed" });
    }
  });

// ── 3. VERIFY PAYMENT (Webhook from Razorpay) ────────────────────────────────
exports.razorpayWebhook = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {
    const crypto = require("crypto");
    const WEBHOOK_SECRET = functions.config().razorpay.webhook_secret;
    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      res.status(400).json({ error: "Invalid webhook signature" });
      return;
    }

    const event = req.body.event;
    if (event === "payment.captured") {
      const payment = req.body.payload.payment.entity;
      try {
        await db.collection("payments").add({
          paymentId: payment.id,
          orderId: payment.order_id,
          amount: payment.amount / 100,
          method: payment.method,
          status: "success",
          email: payment.email,
          date: admin.firestore.FieldValue.serverTimestamp(),
        });
        // Update user plan if email matches
        const usersSnap = await db.collection("users").where("email", "==", payment.email).limit(1).get();
        if (!usersSnap.empty) {
          await usersSnap.docs[0].ref.update({ plan: "paid" });
        }
      } catch (err) {
        console.error("Webhook DB error:", err.message);
      }
    }
    res.status(200).json({ received: true });
  });

// ── 4. SET ADMIN CLAIM ───────────────────────────────────────────────────────
exports.setAdminClaim = functions
  .region("us-central1")
  .https.onCall(async (data, context) => {
    // Only existing admins can call this
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Not authenticated");
    const adminUid = functions.config().app.admin_uid;
    if (context.auth.uid !== adminUid) {
      throw new functions.https.HttpsError("permission-denied", "Not authorized");
    }
    const { uid } = data;
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    await db.collection("users").doc(uid).update({ isAdmin: true });
    return { success: true, message: `Admin claim set for ${uid}` };
  });
