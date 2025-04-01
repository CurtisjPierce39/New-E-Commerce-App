import * as React from 'react';
import { useState } from 'react';
import { authService, UserData } from '../store/authService';
import { useNavigate } from 'react-router-dom';

export const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await authService.login(email, password);
            } else {
                const userData: UserData = { email, name, address };
                await authService.register(email, password, userData);
            }
            navigate('/');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
            setError(errorMessage);
            console.error('Authentication error:', error);
        }
    };

    return (
        <div className="auth-container">
            <h2 data-testid="auth-title">{isLogin ? 'Login' : 'Register'}</h2>
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
                {!isLogin && (
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
                {error && <div data-testid="error-message" className="error-message">{error}</div>}
                <button type="submit" data-testid="submit-button">
                    {isLogin ? 'Login' : 'Register'}
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