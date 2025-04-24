import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from './AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../types/firebaseConfig';
import { clearCart } from '../store/cartSlice';
import { CartItem, RootState } from '../types';
import { useNavigate } from 'react-router-dom';

// typescript interface for Shipping Details
interface ShippingDetails {
    address: string;
    city: string;
    zipCode: string;
    country: string;
}

// variable for Checkout (functional component)
export const Checkout: React.FC = () => {
    // sets state for Checkout function variables
    const { currentUser } = useAuth();
    const cart = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // calculation using reduce on cart items
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // sets state of shipping details as empty strings
    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        address: '',
        city: '',
        zipCode: '',
        country: ''
    });

    // event handler that updates the shipping details state when input fields change
    const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // form event handler to check for user authentication in order to checkout
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

        // validates each item in the cart using "every" array method
        const validItems = cart.items.every((item: CartItem) => (
            item.id &&
            item.name &&
            typeof item.price === 'number' &&
            typeof item.quantity === 'number'
        ));

        // if any items are invalid the checkout process is stopped with an alert message
        if (!validItems) {
            alert('Some items in your cart are invalid. Please try again.');
            return;
        }

        // activates loading state 
        setIsLoading(true);
        try {
            // creates orderData variable
            const orderData = {
                userId: currentUser.uid, //current user's ID 
                items: cart.items.map((item: CartItem) => ({ //maps cart items to new array
                    name: item.name,
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: totalPrice,// total price 
                shippingDetails: { //address into with whitespace trimmed
                    address: shippingDetails.address.trim(),
                    city: shippingDetails.city.trim(),
                    zipCode: shippingDetails.zipCode.trim(),
                    country: shippingDetails.country.trim()
                },
                createdAt: new Date() // current timestamp
            };

            //handles Firebase database operations
            const ordersRef = collection(db, 'orders');
            await addDoc(ordersRef, orderData);
            dispatch(clearCart());
            alert('Thank you for your purchase!');
            navigate('/');
        } catch (error) { //catches errors and logs error to console
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setIsLoading(false); //resets loading state
        }
    };

    // if cart is empty, renders "div" message
    if (cart.items.length === 0) {
        return <div className='border p-3 rounded'><strong>Your cart is empty</strong></div>;
    }

    //renders checkout page
    return (
        <div className="container">
            <h2>Checkout</h2>
            <div className="border p-4 rounded bg-gradient">
                <h3 className='border rounded mx-5 p-3'>Order Summary</h3>
                {cart.items.map(item => ( //maps through cart items
                    <div key={item.id} className="flex border py-4 content rounded">
                        <img src={item.image} alt={item.name} className="m-5 rounded img-fluid" />
                        <p>{item.name}</p>
                        <p>{item.description}</p><br></br>
                        <span><strong>{item.quantity} x ${item.price} = {item.price * item.quantity}</strong></span>
                    </div>
                ))}
                <div className="container border rounded bg-gradient p-3" style={{ fontSize: '30px' }}
                >
                    <strong>Total: ${totalPrice.toFixed(2)}</strong> {/* displays total price to 2 decimals */}
                </div>
            </div>

            {/* form to handle adding shipping details */}
            <form onSubmit={(e: React.FormEvent) => { void handleSubmit(e); }}>
                <div className="mb-4">
                    <h3 className='p-3'>Shipping Details</h3>
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={shippingDetails.address}
                        onChange={handleShippingChange}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={shippingDetails.city}
                        onChange={handleShippingChange}
                        className="p-2 m-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP Code"
                        value={shippingDetails.zipCode}
                        onChange={handleShippingChange}
                        className="p-2 mb-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={shippingDetails.country}
                        onChange={handleShippingChange}
                        className="p-2 m-2 border rounded"
                        required
                    />
                </div>
                <button
                    style={{ backgroundColor: 'crimson' }}
                    type="submit"
                    disabled={isLoading || cart.items.length === 0} //disabled button if processing or cart is empty
                    className="py-2 rounded"
                >
                    {isLoading ? 'Processing...' : 'Complete Purchase'}
                </button>
            </form>
        </div>
    );
};