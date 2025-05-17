import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserNavbar from './UserNavbar';

function UserProfile() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const [profileData, setProfileData] = useState({
        age: '',
        height: '',
        weight: '',
        username: '',
        nickname: '',
        balance: 0
    });
    const [originalProfileData, setOriginalProfileData] = useState({
        age: '',
        height: '',
        weight: '',
        username: '',
        nickname: '',
        balance: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://localhost:7148/api/User/get-profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setProfileData({
                    age: response.data.age,
                    height: response.data.height,
                    weight: response.data.weight,
                    username: response.data.username,
                    nickname: response.data.nickname,
                    balance: response.data.balance
                });
                setOriginalProfileData({
                    age: response.data.age,
                    height: response.data.height,
                    weight: response.data.weight,
                    username: response.data.username,
                    nickname: response.data.nickname,
                    balance: response.data.balance
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching profile:", error);
                setLoading(false);
            });
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaveChanges = () => {
        axios.put('https://localhost:7148/api/User/update-profile', profileData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error("Error updating profile:", error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <UserNavbar/>
            <div className="container mt-5">
                <h2>Profile Information</h2>
                <div className="card p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={profileData.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nickname</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nickname"
                            value={profileData.nickname}
                            disabled
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Age</label>
                        <input
                            type="number"
                            className="form-control"
                            name="age"
                            value={profileData.age}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Height (cm)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="height"
                            value={profileData.height}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Weight (kg)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="weight"
                            value={profileData.weight}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Balance (₼)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="balance"
                            value={profileData.balance}
                            disabled
                        />
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="me-3 fw-bold">Balance: ₼{profileData.balance}</span>
                        <button className="btn btn-secondary me-2" onClick={() => setProfileData(originalProfileData)}>
                            Cancel
                        </button>
                        <button className="btn btn-danger me-2" onClick={() => {
                            sessionStorage.removeItem('token');
                            navigate('/');
                        }}>
                            Logout
                        </button>
                        <button className="btn btn-primary me-2" onClick={() => navigate('/addbalance')}>
                            Add Balance
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={handleSaveChanges}
                            disabled={
                                profileData.age === originalProfileData.age &&
                                profileData.height === originalProfileData.height &&
                                profileData.weight === originalProfileData.weight &&
                                profileData.username === originalProfileData.username
                            }
                        >
                            Save Changes
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}

export default UserProfile;
