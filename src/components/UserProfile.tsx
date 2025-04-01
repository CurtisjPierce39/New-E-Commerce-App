import React, { useEffect, useState } from 'react';
import { userService } from '../store/userService';
import { auth } from '../types/firebaseConfig';

interface UserProfile {
    name?: string;
    email?: string;
    address?: string;
    displayName?: string;
}

export const UserProfile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            if (auth.currentUser) {
                const userData = await userService.getUserProfile(auth.currentUser.uid) as UserProfile;
                setProfile(userData);
                setName(userData?.name || '');
                setAddress(userData?.address || '');
            }
        };
        void loadProfile();
    }, []);

    const handleUpdateProfile = async () => {
        if (auth.currentUser) {
            await userService.updateUserProfile(auth.currentUser.uid, { name, address });
            setProfile((prev) => prev ? { ...prev, name, address } : { name, address });
            setIsEditing(false);
        }
    };

    return (
        <div className='border p-4 rounded bg-gradient'>
            <h2>User Profile</h2>
            {!isEditing ? (
                <div className='m3 rounded p-5 bg-gradient border'>
                    <p>Name: {profile?.name}</p>
                    <p>Email: {profile?.email}</p>
                    <p>Address: {profile?.address}</p>
                    <p>Display Name: {profile?.displayName}</p>
                    <button className='bg-gradient rounded' onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            ) : (
                <div>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                    />
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                    />
                    <button className='bg-gradient rounded' onClick={() => void handleUpdateProfile()}>Save Changes</button>
                    <button className='bg-gradient rounded' onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};