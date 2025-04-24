import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../types';
import { RootState } from '../types';
import { removeFromCart } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';

//typescript interface for CartItem
interface CartItem {
    id: string | number; //id can be number or string
    description: string;
    name: string;
    price: number;
    quantity: number;
    image?: string; //optional product image
}

//exported variable for ShoppingCart (functional component)
export const ShoppingCart: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const totalItems = cartItems.reduce<number>((sum, item) => sum + item.quantity, 0); //calculates total quantity of all items in cart
    const totalPrice = cartItems.reduce<number>((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2); //calculates total price of all items, formatted to 2 decimal places

    const handleCheckout = () => { //navigates to checkout page
        navigate('/checkout');
    };
// renders shopping cart
    return (
        <div className="container">
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <h3>Your cart is empty</h3> // renders message if cart is empty
            ) : (
                <div className="content">
                    {cartItems.map((item: CartItem) => ( //maps through each cart item
                        <div key={item.id} className="flex border rounded bg-gradient p-4">
                            <div className="flex items-center border rounded">
                                <img src={item.image} alt={item.name} className="border rounded img-fluid" />
                                <div className="flex rounded">
                                    <h2>{item.name}</h2>
                                    <p>{item.description}</p>
                                    <div>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    try {
                                        dispatch(removeFromCart(item.id)) //removes item from cart when button is clicked
                                    } catch (error) {
                                        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                                        console.error('Error removing item:', errorMessage);
                                    }
                                }}
                                className="text-white rounded"
                                style={{ backgroundColor: 'crimson' }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <div>
                        <div>
                            <p>Total Items: {totalItems}</p>
                            <p>Total Price: ${totalPrice}</p>
                            <button
                                onClick={handleCheckout} //navigates to checkout page when button is clicked
                                className="rounded text-white"
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