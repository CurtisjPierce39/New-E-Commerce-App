import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// configures access to Firebase database
const firebaseConfig = {
    apiKey: "AIzaSyARR_gnUb1zjJHlKrJWsWMntnqMJyymll8",
    authDomain: "upgraded-e-commerce-app.firebaseapp.com",
    projectId: "upgraded-e-commerce-app",
    storageBucket: "upgraded-e-commerce-app.firebasestorage.app",
    messagingSenderId: "79155321874",
    appId: "1:79155321874:web:3b9b837c89257d17d6cccb"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

