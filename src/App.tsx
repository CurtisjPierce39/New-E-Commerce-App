import { Navbar } from './components/NavBar';
import { Auth } from './components/Login';
import { UserProfile } from './components/UserProfile';
import { ProductList } from './components/ProductList';
import { ShoppingCart } from './components/ShoppingCart';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { store } from './types';
import { Checkout } from './components/Checkout';
import ProductForm from './components/ProductForm';
import Orders from './components/Orders';
import DisplayData from './components/DisplayUsers';
import AddDataForm from './components/AddUserForm';
import './App.css'

// object for accessing web app when logged in
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  //React fragment
  //refers to anything wrapped by "ProtectedRoute"
  return <>{children}</>;
};

const queryClient = new QueryClient();

function App() {
  return (
    //allows for global state management
    //allows for components to access and modify global state
    <QueryClientProvider client={queryClient}>
      {/*allows for components to access and modify global state*/}
      <Provider store={store}>
        {/*allows for components to access and modify global state*/}
        <AuthProvider>
          {/*allows for navigation between different pages*/}
          <BrowserRouter>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <Routes>
                <Route path="/login" element={<Auth />} />
                {/*if user is not logged in, redirect to login page*/}
                <Route path="/" element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                    <DisplayData />
                    <AddDataForm />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/addproducts" element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                } />
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <ShoppingCart />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout/>                      
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;