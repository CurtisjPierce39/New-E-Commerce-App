import React, { createContext, useEffect, useState, useContext } from 'react';
import { auth } from '../types/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
// typescript interface for authentication type
interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
}

// variable used to share authentication state throughout application
const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

// exported variable for useAuth
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
// exported variable for AuthProvider and its children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // useEffect hook to handle user authentication
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                console.log('User authenticated:', user.uid);
            } else {
                setCurrentUser(null);
                console.log('No user authenticated');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // wraps application and provides values to it's children
    return (
        <AuthContext.Provider value={{ currentUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };