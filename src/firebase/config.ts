// import firebase dependecies
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// import firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC4mYjH0kIn4KY8KDuI2lyKzCGWXAfD3F4",
  authDomain: "ultimatio-7811e.firebaseapp.com",
  projectId: "ultimatio-7811e",
  storageBucket: "ultimatio-7811e.appspot.com",
  messagingSenderId: "799431591013",
  appId: "1:799431591013:web:2f2a7b2af18e53cadfb28c"
};

// initialize Firebase
const app = initializeApp(firebaseConfig);

// define firebase auth
export const auth = getAuth();

// define firebase auth google provider
export const GoogleProvider = new GoogleAuthProvider();

// export firebase app as default
export default app;