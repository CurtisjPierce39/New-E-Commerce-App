import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../types';
import { RootState } from '../types';
import { removeFromCart } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';

interface CartItem {
    id: string;
    description: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export const ShoppingCart: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const totalItems = cartItems.reduce<number>((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce<number>((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p className="text-lg text-gray-600">Your cart is empty</p>
            ) : (
                <div className="container grid-cols-3 md:grid-cols-3 gap-5 content">
                    {cartItems.map((item: CartItem) => (
                        <div key={item.id} className="flex border rounded-lg bg-gradient p-4">
                            <div className="flex items-center space-x-4">
                                <img src={item.image} alt={item.name} className="rounded img-fluid" />
                                <div className="flex flex-col space-y-2">
                                    <h2>{item.name}</h2>
                                    <p>{item.description}</p>
                                    <div>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    try {
                                        dispatch(removeFromCart(item.id))
                                    } catch (error) {
                                        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                                        console.error('Error removing item:', errorMessage);
                                    }
                                }}
                                className="px-4 py-2 text-white rounded hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: 'crimson' }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <div className="pt-4">
                        <div className="flex flex-col space-y-2">
                            <p>Total Items: {totalItems}</p>
                            <p>Total Price: ${totalPrice}</p>
                            <button
                                onClick={handleCheckout}
                                className="md:w-auto px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity mt-4"
                                style={{ backgroundColor: 'crimson' }}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingCart;