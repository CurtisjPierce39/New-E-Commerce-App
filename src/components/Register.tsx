import React, { useState } from 'react';
import { registerUser } from '../store/authService';
import { useNavigate } from 'react-router-dom';

// typescript interface for User Form Data
interface UserFormData {
    email: string;
    password: string;
    name: string;
    address: string;
}

// variable for Registering new users(functional component)
const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        password: '',
        name: '',
        address: ''
    });
    const [error, setError] = useState('');

    // handles form submission 
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        void (async () => {
            try {
                await registerUser(formData.email, formData.password, {
                    email: formData.email,
                    name: formData.name,
                    address: formData.address
                });
                navigate('/');
            } catch (error) {
                setError('Failed to register');
                console.error('Registration error:', error);
            }
        })();
    };

    // renders form for user registration
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFormData({ ...formData, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFormData({ ...formData, password: e.target.value })}
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;