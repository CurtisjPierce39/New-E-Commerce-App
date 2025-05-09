import React, { useState } from 'react';
import { db } from '../types/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

// typescript interface for User data
interface User {
    id?: string;
    name: string;
    email: string;
    address: string;
    displayName: string;
}

// variable for adding new user data(functional component)
const AddDataForm: React.FC = () => {
    // sets state for user data and renders empty 
    const [data, setData] = useState<User>({ name: '', email: '', address: '', displayName: ''});

    // variable for handling data change when data is inputted
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    // handles submitted data and creates new user object in firebase collection
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'users'), data);
            alert('New User added!');
            setData({ name: '', email: '', address: '', displayName: ''}); // reset form
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    // renders form for adding new user
    return (
        <form onSubmit={(e: React.FormEvent) => { void handleSubmit(e); }}>
            <h1>Add New User</h1>
            <input name="name" value={data.name} onChange={handleChange} placeholder="Name" />
            <input name="email" value={data.email} onChange={handleChange} placeholder="Email" />
            <input name="address" value={data.address} onChange={handleChange} placeholder="Address" />
            <input name="displayName" value={data.displayName} onChange={handleChange} placeholder="Display Name" /><br></br>
            <button type="submit" className='m-3'>Add User</button>
        </form>
    );
};

export default AddDataForm;