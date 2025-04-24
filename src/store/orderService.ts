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

//typescript interface for OrderItem
export interface OrderItem {
    name: string;
    productId: string;
    productName: string,
    quantity: number;
    price: number;
}

//typescript interface for Order
export interface Order {
    totalAmount: number;
    id: string;
    userId: string;
    items: OrderItem[];
    totalPrice: number;
    createdAt: Date;
}

export const orderService = {
    async createOrder(order: Order) {
        return await addDoc(collection(db, 'orders'), {
            ...order, //spreads all order properties
            createdAt: new Date() //adds current timestamp
        });
    },

    async getUserOrders(userId: string) {
        const q = query(
            collection(db, 'orders'),
            where('userId', '==', userId), //filters orders by user ID
            orderBy('createdAt', 'desc') //sort by creation date, newest first
        );

        const querySnapshot = await getDocs(q); //retrieves documents matching query
        return querySnapshot.docs.map(doc => ({ //returns results and stores them in querySnapshot. Maps through each document
            id: doc.id,
            ...doc.data() //takes document ID, spreads document data and combines them into new object
        }));
    },

    async deleteOrder(orderId: string) {
        const orderRef = doc(db, 'orders', orderId);
        await deleteDoc(orderRef);
    }
};