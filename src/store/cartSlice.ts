import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../types';
//typescript interface for CartState
interface CartState {
    totalPrice: number;
    items: CartItem[];
}

const loadCartFromSession = (): CartState => {
    //attempt to get cart data from session storage
    const savedCart = sessionStorage.getItem('cart');
    //define default empty cart state
    const defaultState: CartState = {
        items: [],
        totalPrice: 0
    };
    //return default state if no saved cart exists
    if (!savedCart) return defaultState;
    try {
        //parse saved cart string to CartState object
        const parsedCart = JSON.parse(savedCart) as CartState;
        return parsedCart;
    } catch {
        //return default state if parsing fails
        return defaultState;
    }
};

//loads cart from session storage
const initialState: CartState = loadCartFromSession();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            // Validates product data
            // Creates CartItem from Product
            // Checks if item exists:
            //   - If exists: increases quantity
            //   - If new: adds to cart
            // Saves to session storage
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
            // Filters out item with matching ID
            // Updates session storage
            state.items = state.items.filter(item => item.id !== action.payload);
            sessionStorage.setItem('cart', JSON.stringify(state));
        },
        clearCart: (state) => {
            // Empties cart array
            // Removes cart from session storage

            state.items = [];
            sessionStorage.removeItem('cart');
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;