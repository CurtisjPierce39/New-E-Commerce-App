import React, { useEffect, useState } from 'react';
import { userService } from '../store/userService';
import { auth } from '../types/firebaseConfig';

//typescript interface for UserProfile
interface UserProfile {
    name?: string;
    email?: string;
    address?: string;
    displayName?: string;
}

// exported variable for UserProfile
export const UserProfile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null); //sores complete user profile data
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            if (auth.currentUser) { // if the current user is authenticated, fetched user profile and sets UserProfile state to current user
                const userData = await userService.getUserProfile(auth.currentUser.uid) as UserProfile;
                setProfile(userData);
                setName(userData?.name || ''); //falls back to empty string when properties are undefined
                setAddress(userData?.address || '');
            }
        };
        void loadProfile();
    }, []);

    const handleUpdateProfile = async () => {
        if (auth.currentUser) { //checks is user is authenticated
            //update profile in backend
            await userService.updateUserProfile(auth.currentUser.uid, { name, address });
            //update local state using functional update
            setProfile((prev) => prev ? { ...prev, name, address } : { name, address });
            //exit edit mode
            setIsEditing(false);
        }
    };
// renders user profile
    return (
        <div className='border p-4 rounded bg-gradient'>
            <h2>User Profile</h2>
            {!isEditing ? (
                <div className='m3 rounded p-5 bg-gradient border'>
                    <p><strong>Name:</strong> {profile?.name}</p>
                    <p><strong>Email:</strong> {profile?.email}</p>
                    <p><strong>Address:</strong> {profile?.address}</p>
                    <p><strong>Display Name:</strong> {profile?.displayName}</p>
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