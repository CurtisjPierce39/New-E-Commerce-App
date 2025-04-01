import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../types/firebaseConfig';
import { UserData } from './authService';

export const userService = {
    async getUserProfile(userId: string) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        return userDoc.data();
    },

    async updateUserProfile(userId: string, data: Partial<UserData>) {
        await updateDoc(doc(db, 'users', userId), data);
    },

    async deleteUser(userId: string) {
        await deleteDoc(doc(db, 'users', userId));
    }
};

export default userService;