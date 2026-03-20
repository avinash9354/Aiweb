// AI resume generation – calls Firebase Function (OpenAI key never on frontend)
import axios from 'axios';
import { auth } from './firebase';

const FUNCTIONS_BASE_URL =
  import.meta.env.VITE_FUNCTIONS_BASE_URL ||
  'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net';

export const generateResume = async (formData, isPaid) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const idToken = await user.getIdToken();

  const response = await axios.post(
    `${FUNCTIONS_BASE_URL}/generateResume`,
    { formData, isPaid },
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};
