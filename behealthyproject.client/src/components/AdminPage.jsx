import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [dietitians, setDietitians] = useState([]);

    useEffect(() => {
        const fetchDietitians = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('https://localhost:7148/api/Admin/get-dietitians', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Gələn dietitianlar:", response.data);
                setDietitians(response.data);
            } catch (error) {
                if (error.response) {
                    console.error("Server error:", error.response.data);
                }
                console.error('Error fetching dietitians:', error);
            }
        };

        fetchDietitians();
    }, []);

    const handleAccept = async (id) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(`https://localhost:7148/api/Admin/approve/${id}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data);

            setDietitians(prev =>
                prev.map(d => d.id === id ? { ...d, status: 1 } : d)
            );
        } catch (error) {
            console.error('Error approving dietitian:', error);
            if (error.response) alert(error.response.data.message);
        }
    };

    const handleDecline = async (id) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(`https://localhost:7148/api/Admin/decline/${id}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data);

            setDietitians(prev =>
                prev.map(d => d.id === id ? { ...d, status: 2 } : d)
            );
        } catch (error) {
            console.error('Error declining dietitian:', error);
            if (error.response) alert(error.response.data.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Dietitian Requests</h1>
            <div className="row g-4">
                {dietitians.map((dietitian) => (
                    <div key={dietitian.id} className="col-md-6 col-lg-4">
                        <div className="card shadow-sm h-100">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{dietitian.username}</h5>
                                {dietitian.nickname && <h6 className="card-subtitle mb-2 text-muted">{dietitian.nickname}</h6>}
                                {dietitian.specialization && <p className="card-text"><strong>Specialization:</strong> {dietitian.specialization}</p>}
                                {dietitian.experience !== null && <p className="card-text"><strong>Experience:</strong> {dietitian.experience} years</p>}
                                {dietitian.certificateImagePaths.length > 0 && (
                                    <div className="mb-2">
                                        <strong>Uploaded Certificates:</strong>
                                        <div className="d-flex flex-wrap gap-2">
                                            {dietitian.certificateImagePaths.map((path, idx) => (
                                                <img
                                                    key={idx}
                                                    src={`https://localhost:7148/${path}`}
                                                    alt={`Certificate ${idx + 1}`}
                                                    className="img-thumbnail"
                                                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="mt-auto d-flex justify-content-between">
                                    <button
                                        onClick={() => handleAccept(dietitian.id)}
                                        className="btn btn-success"
                                        disabled={dietitian.status === 1 || dietitian.status === 2}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleDecline(dietitian.id)}
                                        className="btn btn-danger"
                                        disabled={dietitian.status === 1 || dietitian.status === 2}
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;
