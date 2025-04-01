import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCdTru7bNbzFaANO8ekln9jZH5YruoR6zc",
    authDomain: "new-e-commerce-app-c672e.firebaseapp.com",
    projectId: "new-e-commerce-app-c672e",
    storageBucket: "new-e-commerce-app-c672e.firebasestorage.app",
    messagingSenderId: "824242543168",
    appId: "1:824242543168:web:95dc12c16fd2b682badda5"};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

