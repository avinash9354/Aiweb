// Razorpay payment service
import { auth } from './firebase';
import { savePayment, updateUserProfile } from './firestoreService';
import axios from 'axios';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const FUNCTIONS_BASE_URL =
  import.meta.env.VITE_FUNCTIONS_BASE_URL ||
  'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net';

export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const initiatePayment = async ({ amount, userProfile, onSuccess, onFailure }) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure('Failed to load Razorpay SDK.');
    return;
  }

  const user = auth.currentUser;
  const idToken = await user.getIdToken();

  // Create order on backend for security
  let orderId;
  try {
    const { data } = await axios.post(
      `${FUNCTIONS_BASE_URL}/createOrder`,
      { amount },
      { headers: { Authorization: `Bearer ${idToken}` } }
    );
    orderId = data.orderId;
  } catch {
    // Fallback – skip order id if backend not configured yet
    orderId = undefined;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: amount * 100, // in paise
    currency: 'INR',
    name: 'AI Resume Builder',
    description: 'Pro Plan Subscription',
    order_id: orderId,
    prefill: {
      name: userProfile?.name || '',
      email: userProfile?.email || '',
    },
    theme: { color: '#6366f1' },
    handler: async (response) => {
      try {
        await savePayment({
          userId: user.uid,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          amount,
          method: 'razorpay',
          status: 'success',
        });
        await updateUserProfile(user.uid, { plan: 'paid' });
        onSuccess(response);
      } catch (err) {
        onFailure(err.message);
      }
    },
    modal: {
      ondismiss: () => onFailure('Payment cancelled.'),
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
