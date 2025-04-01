import React, { useState } from 'react';
import { registerUser } from '../store/authService';
import { useNavigate } from 'react-router-dom';

interface UserFormData {
    email: string;
    password: string;
    name: string;
    address: string;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        password: '',
        name: '',
        address: ''
    });
    const [error, setError] = useState('');

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