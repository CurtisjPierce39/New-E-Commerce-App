import { useState, useEffect } from 'react';
import { db } from '../types/firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// typescript interface for User
interface User {
    id?: string;
    name: string;
    email: string;
    address: string;
    displayName: string;
}

// variable to display users
const DisplayData = () => {
    // Sets state for DisplayData variables
    const [users, setUsers] = useState<User[]>([]);
    const [newEmail, setNewEmail] = useState<string>('');
    const [newName, setNewName] = useState<string>('');
    const [newAddress, setNewAddress] = useState<string>('');
    const [newDisplayName, setDisplayName] = useState<string>('');

    // variable to update User information
    const updateUser = async (userId: string, updatedData: { name?: string; email?: string; address?: string; displayName?: string; }) => {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, updatedData);
        alert("User Info Updated!")
    };
    // variable to delete User doc from database
    const deleteUser = async (userId: string) => {
        await deleteDoc(doc(db, 'users', userId))
        alert("User Deleted!")
    }
    // useEffect hook to fetch User collection from firebase
    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const dataArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as unknown as User[];
            setUsers(dataArray);
        };

        void fetchData();
    }, []);

    // renders list of Users
    return (
        <div>
            <h2>Users List</h2>
            {users.map((user) => (
                <div
                    key={user.id}
                    className='border p-4 bg-gradient rounded'
                >
                    <div key={user.id} className='bg-gradient rounded p-3 border'>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Address:</strong> {user.address}</p>
                        <p><strong>Display Name:</strong> {user.displayName}</p>
                    </div>
                    {/* input fields to update user information */}
                    <input
                        onChange={(e) => setNewName(e.target.value)}
                        type="string"
                        placeholder="Enter new name:"
                    />
                    <button className='bg-gradient rounded m-2' onClick={() => void updateUser(user.id!, { name: newName })}>
                        Update Name
                    </button><br></br>
                    <input
                        onChange={(e) => setNewEmail(e.target.value)}
                        type="string"
                        placeholder="Enter new email:"
                    />
                    <button className='bg-gradient rounded m-2' onClick={() => void updateUser(user.id!, { email: newEmail })}>
                        Update Email
                    </button><br></br>
                    <input
                        onChange={(e) => setNewAddress(e.target.value)}
                        type="string"
                        placeholder="Enter new address:"
                    />
                    <button className='bg-gradient rounded m-2' onClick={() => void updateUser(user.id!, { address: newAddress })}>
                        Update Address
                    </button><br></br>
                    <input
                        onChange={(e) => setDisplayName(e.target.value)}
                        type="string"
                        placeholder="Enter new display name:"
                    />
                    <button className='bg-gradient rounded m-2' onClick={() => void updateUser(user.id!, { displayName: newDisplayName })}>
                        Update Display Name
                    </button><br></br>
                    <button className='bg-gradient rounded m-2' style={{ backgroundColor: 'crimson' }} onClick={() => void deleteUser(user.id!)}>Delete User</button>
                </div>
            ))}
        </div>
    );
};

export default DisplayData;