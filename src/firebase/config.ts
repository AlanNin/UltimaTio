// import firebase dependecies
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { env } from "~/env";

// import firebase config
const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
};

// initialize Firebase
const app = initializeApp(firebaseConfig);

// define firebase auth
export const auth = getAuth();

// define firebase auth google provider
export const GoogleProvider = new GoogleAuthProvider();

// export firebase app as default
export default app;
