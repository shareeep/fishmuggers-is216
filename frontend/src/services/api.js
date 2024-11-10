import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

console.log("API URL:", import.meta.env.VITE_APP_API_URL); // Debugging

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);
const auth = getAuth();

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL, // Ensure this environment variable is set correctly
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(/* forceRefresh */ true);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

console.log("Axios Instance Config:", api.defaults);


export default api;
