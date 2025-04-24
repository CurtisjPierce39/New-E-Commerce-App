import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { orderService, OrderItem, Order } from '../store/orderService';

// variable for Order History
const OrderHistory: React.FC = () => {
    // set state of "OrderHistory" variables
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    // useEffect hook for fetching orders for current user
    useEffect(() => {
        const fetchOrders = async () => {
            if (!currentUser) return; //if no authenticated user exit function early

            try {
                const userOrders = await orderService.getUserOrders(currentUser.uid);
                setOrders(userOrders as Order[]);
            } catch (err) {
                setError('Failed to fetch orders');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        void fetchOrders();
    }, [currentUser]);

    const handleDeleteOrder = async (orderId: string) => {
        // confirmation alert when attempting to delete order
        if (!window.confirm('Are you sure you want to delete this order?')) return;

        try {
            await orderService.deleteOrder(orderId);
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        } catch (err) {
            setError('Failed to delete order');
            console.error(err);
        }
    };

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className="error-message">{error}</div>;

    // renders list of orders for current user
    return (
        <div>
            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="border m-3 pb-4 mx-5 rounded">
                        <div className="border m-2 p-3 bg-gradient rounded">
                            <span>Order ID: {order.id}</span><br></br>
                            <span>User ID: {order.userId}</span><br></br>
                            <span>Date: {order.createdAt && typeof order.createdAt === 'object' && 'toDate' in order.createdAt ? (order.createdAt as { toDate(): Date }).toDate().toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                            {order.items.map((item: OrderItem, index: number) => (
                                <div key={index}><br></br>
                                    <span>Product: {item.name}</span><br></br>
                                    <span>Quantity: {item.quantity}</span><br></br>
                                    <span>Price: ${item.price}</span><br></br>
                                </div>
                            ))}
                        </div><br></br>
                        <div className="order-total">
                            <h2><strong>Total: ${order.totalAmount}</strong></h2>
                        </div><br></br>

                        <button
                            onClick={() => void handleDeleteOrder(order.id)}
                            className="px-4 py-2 text-white rounded hover:opacity-90 transition-opacity float-right"
                            style={{ backgroundColor: 'crimson' }}
                        >
                            Delete Order
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistory;