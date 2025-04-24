import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    UserCredential
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../types/firebaseConfig';

// typescript interface for UserData
export interface UserData {
    email: string;
    name: string;
    address?: string;
}
// typescript object to register new user
export const registerUser = async (
    email: string, 
    password: string, 
    userData: UserData

): Promise<UserCredential> => { //returns a promise of UserCredential
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        createdAt: new Date()
    });
    return userCredential;
};
// exported object for authentication services
export const authService = {
    async register(email: string, password: string, userData: UserData): Promise<UserCredential> {
        return registerUser(email, password, userData);
    },

    async login(email: string, password: string): Promise<UserCredential> {
        return signInWithEmailAndPassword(auth, email, password);
    },

    async logout(): Promise<void> {
        await signOut(auth);
    }
};