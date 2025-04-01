import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Auth } from '../components/Login';
import { authService } from '../store/authService';

interface UserData {
    email: string;
    name: string;
    address: string;
}

interface AuthResponse {
    user: {
        uid: string;
    };
}

jest.mock('../store/authService', () => ({
    authService: {
        login: jest.fn<Promise<AuthResponse>, [string, string]>().mockImplementation(async (email: string, password: string): Promise<AuthResponse> => {
            if (!email || !password) throw new Error('Invalid credentials');
            await Promise.resolve(); // Add await expression
            return { user: { uid: '123' } };
        }),
        register: jest.fn<Promise<AuthResponse>, [string, string, UserData]>().mockImplementation(async (email: string, password: string, userData: UserData): Promise<AuthResponse> => {
            if (!email || !password || !userData) throw new Error('Invalid registration data');
            await Promise.resolve(); // Add await expression
            return { user: { uid: '123' } };
        })
    }
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

describe('Auth Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderAuth = () => {
        return render(
            <BrowserRouter>
                <Auth />
            </BrowserRouter>
        );
    };

    describe('Login Mode', () => {
        it('renders login form by default', () => {
            renderAuth();
            expect(screen.getByTestId('auth-title')).toHaveTextContent('Login');
            expect(screen.getByTestId('email-input')).toBeInTheDocument();
            expect(screen.getByTestId('password-input')).toBeInTheDocument();
            expect(screen.queryByTestId('name-input')).not.toBeInTheDocument();
        });

        it('handles successful login', async () => {
            (authService.login as jest.Mock).mockResolvedValueOnce({ user: { uid: '123' } });
            renderAuth();
            
            const emailInput = screen.getByTestId('email-input');
            const passwordInput = screen.getByTestId('password-input');
            const submitButton = screen.getByTestId('submit-button');
    
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
            fireEvent.click(submitButton);
            await waitFor(() => {
                const loginFn = () => authService.login;
                expect(loginFn()).toHaveBeenCalledWith('test@example.com', 'password123');
                expect(mockNavigate).toHaveBeenCalledWith('/');
            });
        });

        it('handles login error', async () => {
            const mockError = new Error('Login failed');
            (authService.login as jest.Mock).mockRejectedValueOnce(mockError);

            renderAuth();
            const emailInput = screen.getByTestId('email-input');
            const passwordInput = screen.getByTestId('password-input');
            const submitButton = screen.getByTestId('submit-button');

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            fireEvent.click(submitButton);
            await waitFor(() => {
                const loginFn = () => authService.login;
                expect(loginFn()).toHaveBeenCalledWith('test@example.com', 'password123');
                expect(screen.getByTestId('error-message')).toHaveTextContent('Login failed');
            });
        });

        it('switches to register form', () => {
            renderAuth();
            const switchButton = screen.getByTestId('toggle-auth-mode-button');
            fireEvent.click(switchButton);

            expect(screen.getByTestId('auth-title')).toHaveTextContent('Register');
            expect(screen.getByTestId('name-input')).toBeInTheDocument();
            expect(screen.getByTestId('address-input')).toBeInTheDocument();
        });

        it('handles successful registration', async () => {
            renderAuth();
            const switchButton = screen.getByTestId('toggle-auth-mode-button');
            fireEvent.click(switchButton);

            const emailInput = screen.getByTestId('email-input');
            const passwordInput = screen.getByTestId('password-input');
            const nameInput = screen.getByTestId('name-input');
            const addressInput = screen.getByTestId('address-input');
            const submitButton = screen.getByTestId('submit-button');

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(nameInput, { target: { value: 'Test User' } });
            fireEvent.change(addressInput, { target: { value: 'Test Address' } });

            fireEvent.click(submitButton);

            const userData: UserData = {
                email: 'test@example.com',
                name: 'Test User',
                address: 'Test Address'
            };

            await waitFor(() => {
                const registerFn = () => authService.register;
                expect(registerFn()).toHaveBeenCalledWith(
                    'test@example.com',
                    'password123',
                    userData
                );
                expect(mockNavigate).toHaveBeenCalledWith('/');
            });
        });
    });
});