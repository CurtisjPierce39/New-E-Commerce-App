import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../types';

interface CartState {
    totalPrice: number;
    items: CartItem[];
}

const loadCartFromSession = (): CartState => {
    const savedCart = sessionStorage.getItem('cart');
    const defaultState: CartState = {
        items: [],
        totalPrice: 0
    };
    if (!savedCart) return defaultState;
    try {
        const parsedCart = JSON.parse(savedCart) as CartState;
        return parsedCart;
    } catch {
        return defaultState;
    }
};

const initialState: CartState = loadCartFromSession();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const product = action.payload;
            if (!product.id || typeof product.price !== 'number' || !product.category || !product.description) {
                console.error('Invalid product data:', product);
                return;
            }
            // Create a valid CartItem with all required fields
            const cartItem: CartItem = {
                id: product.id,
                name: product.name || product.title || '',
                price: product.price,
                category: product.category,
                description: product.description,
                rating: product.rating,
                image: product.image || product.imageUrl,
                quantity: 1
            };
            const existingItem = state.items.find(item => item.id === cartItem.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push(cartItem);
            }
            sessionStorage.setItem('cart', JSON.stringify(state));
        },
        removeFromCart: (state, action: PayloadAction<string | number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            sessionStorage.setItem('cart', JSON.stringify(state));
        },
        clearCart: (state) => {
            state.items = [];
            sessionStorage.removeItem('cart');
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;