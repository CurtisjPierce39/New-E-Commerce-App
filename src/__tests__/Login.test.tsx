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
// mock importing authService module
jest.mock('../store/authService', () => ({
    // mocks user login and user registration
    authService: {
        login: jest.fn<Promise<AuthResponse>, [string, string]>().mockImplementation(async (email: string, password: string): Promise<AuthResponse> => {
            if (!email || !password) throw new Error('Invalid credentials'); //throws error if email or password is invalid
            await Promise.resolve();
            return { user: { uid: '123' } }; //returns mock user response with a unique id of 123
        }),
        register: jest.fn<Promise<AuthResponse>, [string, string, UserData]>().mockImplementation(async (email: string, password: string, userData: UserData): Promise<AuthResponse> => {
            if (!email || !password || !userData) throw new Error('Invalid registration data');
            await Promise.resolve();
            return { user: { uid: '123' } };
        })
    }
}));
// mocks navigate using react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});
// creates test suite using "describe()"
describe('Auth Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
// wraps Auth component with BrowserRouter
    const renderAuth = () => {
        return render(
            <BrowserRouter>
                <Auth />
            </BrowserRouter>
        );
    };

    describe('Login Mode', () => {
        // creates nested test suite for login functionality
        it('renders login form by default', () => {
            renderAuth();
            expect(screen.getByTestId('auth-title')).toHaveTextContent('Login');
            expect(screen.getByTestId('email-input')).toBeInTheDocument();
            expect(screen.getByTestId('password-input')).toBeInTheDocument();
            expect(screen.queryByTestId('name-input')).not.toBeInTheDocument();
        });

        // mocks login function at successful login with User Id
        it('handles successful login', async () => {
            // sets up mock login to only succeed once
            (authService.login as jest.Mock).mockResolvedValueOnce({ user: { uid: '123' } });
            renderAuth();
            
            const emailInput = screen.getByTestId('email-input');
            const passwordInput = screen.getByTestId('password-input');
            const submitButton = screen.getByTestId('submit-button');
    
            // mocks email and password input
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
            // mocks clicking the submit button
            fireEvent.click(submitButton);
            // mocks async operations
            await waitFor(() => {
                const loginFn = () => authService.login;
                // expects login info to be "test@example.com" and "password123"
                expect(loginFn()).toHaveBeenCalledWith('test@example.com', 'password123');
                // mocks navigating to homepage after successful login
                expect(mockNavigate).toHaveBeenCalledWith('/');
            });
        });

        // mocks error at login
        it('handles login error', async () => {
            // creates a mock error with message "Login failed"
            const mockError = new Error('Login failed');
            // configures the login mock to reject with this error
            (authService.login as jest.Mock).mockRejectedValueOnce(mockError);

            // renders the Auth component
            renderAuth();
            const emailInput = screen.getByTestId('email-input');
            const passwordInput = screen.getByTestId('password-input');
            const submitButton = screen.getByTestId('submit-button');

            // mocks email and password input
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            // mocks clicking submit button
            fireEvent.click(submitButton);
            await waitFor(() => {
                const loginFn = () => authService.login;
                expect(loginFn()).toHaveBeenCalledWith('test@example.com', 'password123');
                expect(screen.getByTestId('error-message')).toHaveTextContent('Login failed');
            });
        });

        // mocks switching login for to register form
        it('switches to register form', () => {
            renderAuth();
            const switchButton = screen.getByTestId('toggle-auth-mode-button');
            // mocks clicking submit button to switch to register form
            fireEvent.click(switchButton);

            // expects "name" and "address" forms to render when switching to register
            expect(screen.getByTestId('auth-title')).toHaveTextContent('Register');
            expect(screen.getByTestId('name-input')).toBeInTheDocument();
            expect(screen.getByTestId('address-input')).toBeInTheDocument();
        });

        // mocks successful registration
        it('handles successful registration', async () => {
            renderAuth();
            const switchButton = screen.getByTestId('toggle-auth-mode-button');
            // mocks switching to register form
            fireEvent.click(switchButton);

            // mocks rendering registration forms
            const emailInput = screen.getByTestId('email-input');
            const passwordInput = screen.getByTestId('password-input');
            const nameInput = screen.getByTestId('name-input');
            const addressInput = screen.getByTestId('address-input');
            const submitButton = screen.getByTestId('submit-button');

            // mocks user input for registration 
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.change(nameInput, { target: { value: 'Test User' } });
            fireEvent.change(addressInput, { target: { value: 'Test Address' } });

            fireEvent.click(submitButton);

            // mocks user info input
            const userData: UserData = {
                email: 'test@example.com',
                name: 'Test User',
                address: 'Test Address'
            };

            await waitFor(() => {
                // referencing mocked register function
                const registerFn = () => authService.register;
                // checks if register was called with correct parameters
                expect(registerFn()).toHaveBeenCalledWith(
                    'test@example.com',
                    'password123',
                    userData
                );
                // checks if user is redirected to home page
                expect(mockNavigate).toHaveBeenCalledWith('/');
            });
        });
    });
});