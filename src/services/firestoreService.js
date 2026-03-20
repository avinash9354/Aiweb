// Firestore database service - CRUD operations
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';

// ── USERS ────────────────────────────────────────────────────────────────────
export const createUserProfile = async (uid, data) => {
  await setDoc(doc(db, 'users', uid), {
    uid,
    ...data,
    isAdmin: false,
    plan: 'free',
    signupDate: serverTimestamp(),
  });
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(db, 'users', uid), { ...data });
};

export const getAllUsers = async () => {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── RESUMES ──────────────────────────────────────────────────────────────────
export const saveResume = async (userId, resumeData) => {
  const ref = await addDoc(collection(db, 'resumes'), {
    userId,
    ...resumeData,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getUserResumes = async (userId) => {
  const q = query(
    collection(db, 'resumes'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getResumeById = async (resumeId) => {
  const snap = await getDoc(doc(db, 'resumes', resumeId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateResume = async (resumeId, data) => {
  await updateDoc(doc(db, 'resumes', resumeId), { ...data, updatedAt: serverTimestamp() });
};

export const deleteResume = async (resumeId) => {
  await deleteDoc(doc(db, 'resumes', resumeId));
};

export const getAllResumes = async () => {
  const snap = await getDocs(collection(db, 'resumes'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── PAYMENTS ─────────────────────────────────────────────────────────────────
export const savePayment = async (paymentData) => {
  const ref = await addDoc(collection(db, 'payments'), {
    ...paymentData,
    date: serverTimestamp(),
  });
  return ref.id;
};

export const getUserPayments = async (userId) => {
  const q = query(
    collection(db, 'payments'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getAllPayments = async () => {
  const snap = await getDocs(collection(db, 'payments'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
