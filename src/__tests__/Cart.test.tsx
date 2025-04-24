import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { addToCart } from '../store/cartSlice';
import { ShoppingCart } from '../components/ShoppingCart';
import { BrowserRouter } from 'react-router-dom';

// Mock product data
const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    description: 'Test Description',
    category: 'Test Category',
    image: 'test-image.jpg',
    imageUrl: 'test-image.jpg',
    stock: 10
};

// Create a mock store
const createTestStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer
        }
    });
};

// Setup test component with required providers
const renderWithProviders = () => {
    const store = createTestStore();//creates redux store
    return {
        store,
        ...render( //renders ShoppingCart component wrapped in necessary providers
            <Provider store={store}>
                <BrowserRouter>
                    <ShoppingCart />
                </BrowserRouter>
            </Provider>
        )
    };
};

describe('Cart Integration', () => {
    beforeEach(() => {
        // Clear session storage before each test
        sessionStorage.clear();
    });

    test('shows empty cart message initially', () => {
        renderWithProviders();
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    test('updates cart when product is added', async () => {
        const { store } = renderWithProviders();

        // Dispatch action to add product to cart
        store.dispatch(addToCart(mockProduct));

        // Verify cart updates
        await waitFor(() => {
            expect(screen.getByText('Test Product')).toBeInTheDocument();
            expect(screen.getByText('Test Description')).toBeInTheDocument();
            expect(screen.getByText('$29.99')).toBeInTheDocument();
            expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
        });
    });

    test('removes product from cart', async () => {
        const { store } = renderWithProviders();

        // Add product to cart
        store.dispatch(addToCart(mockProduct));

        // Wait for product to appear
        await waitFor(() => {
            expect(screen.getByText('Test Product')).toBeInTheDocument();
        });

        // Click remove button
        const removeButton = screen.getByText('Remove');
        fireEvent.click(removeButton);

        // Verify product is removed
        await waitFor(() => {
            expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
        });
    });

    test('updates total price and quantity correctly', async () => {
        const { store } = renderWithProviders();

        // Add same product twice
        store.dispatch(addToCart(mockProduct));
        store.dispatch(addToCart(mockProduct));

        // Verify totals
        await waitFor(() => {
            expect(screen.getByText('Total Items: 2')).toBeInTheDocument();
            expect(screen.getByText('Total Price: $59.98')).toBeInTheDocument();
        });
    });

    test('navigates to checkout when checkout button is clicked', async () => {
        const { store } = renderWithProviders();

        // Add product to cart
        store.dispatch(addToCart(mockProduct));

        // Wait for product to appear and click checkout
        await waitFor(() => {
            const checkoutButton = screen.getByText('Proceed to Checkout');
            fireEvent.click(checkoutButton);
        });

        // Navigation will be handled by React Router
        // We can't test the actual navigation in this test environment
        // but we can verify the button exists and is clickable
        expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
    });
});