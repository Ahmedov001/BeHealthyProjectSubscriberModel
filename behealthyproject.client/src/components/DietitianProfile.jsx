import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DietitianNavbar from './DietitianNavbar';

function DietitianProfile() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const [profileData, setProfileData] = useState({
        certifications: [],
        experience: 0,
        price:0,
        specialization: "",
        username: '',
        nickname: ''
    });
    const [originalProfileData, setOriginalProfileData] = useState({
        certifications: [],
        experience: 0,
        price:0,
        specialization: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://localhost:7148/api/Dietitian/get-profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setProfileData({
                    username: response.data.username,
                    nickname: response.data.nickname,
                    certifications: response.data.certifications,
                    experience: response.data.experience,
                    specialization: response.data.specialization,
                    price: response.data.price,
                });
                setOriginalProfileData({
                    username: response.data.username,
                    nickname: response.data.nickname,
                    certifications: response.data.certifications,
                    experience: response.data.experience,
                    price: response.data.price,
                    specialization: response.data.specialization,
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
        axios.put('https://localhost:7148/api/Dietitian/update-profile', profileData, {
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
            <DietitianNavbar/>
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
                        <label className="form-label">Experience</label>
                        <input
                            type="number"
                            className="form-control"
                            name="experience"
                            value={profileData.experience}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input
                            type="number"
                            className="form-control"
                            name="price"
                            value={profileData.price}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Specializaton</label>
                        <input
                            type="text"
                            className="form-control"
                            name="specialization"
                            value={profileData.specialization}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Certifications</label>
                        <input
                            type="text"
                            className="form-control"
                            name="certifications"
                            value={profileData.certifications}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-secondary" onClick={() => setProfileData(originalProfileData)}>
                            Cancel
                            
                        </button>
                        <button className="btn btn-danger" onClick={() => {
                            sessionStorage.removeItem('token');
                            navigate('/signin/dietitian');
                        }}>
                            Logout
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={handleSaveChanges}
                            disabled={
                                profileData.specialization === originalProfileData.specialization &&
                                profileData.experience === originalProfileData.experience &&
                                profileData.certifications === originalProfileData.certifications &&
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

export default DietitianProfile;
