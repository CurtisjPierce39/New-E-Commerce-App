import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db } from '../types/firebaseConfig';

export interface Product {
    productId: string;
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    imageUrl: string;
    category: string;
}

export type NewProduct = Omit<Product, 'productId' | 'id'>;

export const productService = {
    async getAllProducts() {
        const querySnapshot = await getDocs(collection(db, 'products'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    },

    async createProduct(product: NewProduct) {
        return await addDoc(collection(db, 'products'), product);
    },

    async updateProduct(productId: string, data: Partial<Product>) {
        await updateDoc(doc(db, 'products', productId), data);
    },

    async deleteProduct(productId: string) {
        await deleteDoc(doc(db, 'products', productId));
    }
};