import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../store/cartSlice';


export interface Product {
    id: string | number;
    title?: string;
    name?: string;
    price: number;
    category: string;
    description: string;
    rating?: {
        rate: number;
        count: number;
    };
    image?: string;
    imageUrl?: string;
    stock?: number;
}

export interface CartItem extends Omit<Product, 'title'> {
    name: string;
    quantity: number;
}

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;