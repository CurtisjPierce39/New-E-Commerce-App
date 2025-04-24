import * as React from 'react';
import { useState } from 'react';
import { authService, UserData } from '../store/authService';
import { useNavigate } from 'react-router-dom';

export const Auth: React.FC = () => {
    //sets state of objects and hooks
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //handles async operations and form submissions
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); //clears any existing errors 
        try {
            if (isLogin) {
                await authService.login(email, password); // calls authService.login with email/password
            } else {
                const userData: UserData = { email, name, address };
                await authService.register(email, password, userData); //creates userData object and calls authService.register
            }
            navigate('/'); //navigates to homepage
        } catch (error) {
            //captures error message, updates error state and logs error to console
            const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
            setError(errorMessage);
            console.error('Authentication error:', error);
        }
    };

    //renders login/registration form
    return (
        <div className="auth-container">
            <h2 data-testid="auth-title">{isLogin ? 'Login' : 'Register'}</h2> {/* toggles between login and register forms*/}
            <form onSubmit={(e: React.FormEvent) => { void handleSubmit(e); }} data-testid="auth-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="email-input"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="password-input"
                    required
                />
                {!isLogin && ( //only renders if isLogin is false
                    <>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            data-testid="name-input"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            data-testid="address-input"
                            required
                        />
                    </>
                )}
                {error && <div data-testid="error-message" className="error-message">{error}</div>} {/* displays error messages only when error state is not empty */}
                <button type="submit" data-testid="submit-button">
                    {isLogin ? 'Login' : 'Register'}  {/* text changes based on mode */}
                </button>
            </form>
            <button 
                onClick={() => setIsLogin(!isLogin)} 
                data-testid="toggle-auth-mode-button"
            >
                {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
            </button>
        </div>
    );
};