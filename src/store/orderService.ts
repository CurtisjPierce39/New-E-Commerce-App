import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    doc,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../types/firebaseConfig';

export interface OrderItem {
    productId: string;
    productName: string,
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalPrice: number;
    createdAt: Date;
}

export const orderService = {
    async createOrder(order: Order) {
        return await addDoc(collection(db, 'orders'), {
            ...order,
            createdAt: new Date()
        });
    },

    async getUserOrders(userId: string) {
        const q = query(
            collection(db, 'orders'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    async deleteOrder(orderId: string) {
        const orderRef = doc(db, 'orders', orderId);
        await deleteDoc(orderRef);
    }
};