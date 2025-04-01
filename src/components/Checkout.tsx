import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from './AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../types/firebaseConfig';
import { clearCart } from '../store/cartSlice';
import { CartItem, RootState } from '../types';
import { useNavigate } from 'react-router-dom';

interface ShippingDetails {
    address: string;
    city: string;
    zipCode: string;
    country: string;
}

export const Checkout: React.FC = () => {
    const { currentUser } = useAuth();
    const cart = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        address: '',
        city: '',
        zipCode: '',
        country: ''
    });

    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser?.uid) {
            alert('Please login to checkout');
            return;
        }

        if (!cart.items.length) {
            alert('Your cart is empty');
            return;
        }

        const validItems = cart.items.every((item: CartItem) => (
            item.id &&
            item.name &&
            typeof item.price === 'number' &&
            typeof item.quantity === 'number'
        ));

        if (!validItems) {
            alert('Some items in your cart are invalid. Please try again.');
            return;
        }

        setIsLoading(true);
        try {
            const orderData = {
                userId: currentUser.uid,
                items: cart.items.map((item: CartItem) => ({
                    name: item.name,
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: totalPrice,
                shippingDetails: {
                    address: shippingDetails.address.trim(),
                    city: shippingDetails.city.trim(),
                    zipCode: shippingDetails.zipCode.trim(),
                    country: shippingDetails.country.trim()
                },
                status: 'pending',
                createdAt: new Date()
            };

            const ordersRef = collection(db, 'orders');
            await addDoc(ordersRef, orderData);
            dispatch(clearCart());
            alert('Thank you for your purchase!');
            navigate('/');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (cart.items.length === 0) {
        return <div>Your cart is empty</div>;
    }

    return (
        <div className="container">
            <h2>Checkout</h2>
            <div className="border p-4 rounded container grid-cols-3 md:grid-cols-3 gap-4 justify-content-md-center bg-gradient">
                <h3 className='border rounded mx-5 p-3'>Order Summary</h3>
                {cart.items.map(item => (
                    <div key={item.id} className="flex border py-4 content rounded">
                        <img src={item.image} alt={item.name} className="w-24 h-24 m-5 rounded object-contain img-fluid" />
                        <p>{item.name}</p><br></br>
                        <p>{item.description}</p><br></br>
                        <span><strong>{item.quantity} x ${item.price} = {item.price * item.quantity}</strong></span>
                    </div>
                ))}
                <div className="order-total container border rounded bg-gradient p-3" style={{ fontSize: '20px' }}
                >
                    <strong>Total: ${totalPrice.toFixed(2)}</strong>
                </div>
            </div>

            <form onSubmit={(e: React.FormEvent) => { void handleSubmit(e); }}>
                <div className="shipping-details mb-4">
                    <h3 className='p-3'>Shipping Details</h3>
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={shippingDetails.address}
                        onChange={handleShippingChange}
                        className="w-full p-2 m-2 mb-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={shippingDetails.city}
                        onChange={handleShippingChange}
                        className="w-full p-2 mb-2 m-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP Code"
                        value={shippingDetails.zipCode}
                        onChange={handleShippingChange}
                        className="w-full p-2 mb-2 m-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={shippingDetails.country}
                        onChange={handleShippingChange}
                        className="w-full p-2 mb-2 m-2 border rounded"
                        required
                    />
                </div>
                <button
                    style={{ backgroundColor: 'crimson' }}
                    type="submit"
                    disabled={isLoading || cart.items.length === 0}
                    className="checkout-button py-2 rounded"
                >
                    {isLoading ? 'Processing...' : 'Complete Purchase'}
                </button>
            </form>
        </div>
    );
};