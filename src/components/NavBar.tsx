import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../types/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../types';
import { useSelector } from 'react-redux';

// variable for navbar(functional component)
export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const user = auth.currentUser; // gets current firebase auth user
    const cartItems = useSelector((state: RootState) => state.cart.items); //gets cart items from redux
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0); //calculates total items in cart


    const handleLogout = async () => {
        try {
            await auth.signOut();//firebase sign out
            navigate('/login'); //navigate to login page
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">My E-Commerce App</Link>
            </div>
            <div className="navbar-links">
                <Link to="/addproducts">Add Products</Link> 
                {user ? (
                    <>
                        <Link to="/cart">
                            <span>Cart&nbsp;</span> {/* cart link with item counter */}
                            {totalItems > 0 && (
                                <span>
                                    ({totalItems})
                                </span>
                            )}
                        </Link>
                        <Link to="/orders">Orders</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="/checkout">Checkout</Link>
                        <button className="logout-btn" onClick={() => { void handleLogout(); }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
};