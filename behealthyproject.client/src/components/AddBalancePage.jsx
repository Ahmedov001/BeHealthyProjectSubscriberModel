import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddBalancePage() {
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    const handleSubmit = () => {
        axios.post('https://localhost:7148/api/User/add-balance', { amount: parseFloat(amount) }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => navigate('/userprofile'))
            .catch(err => console.error("Balance update error:", err));
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 mx-auto" style={{ maxWidth: '400px', backgroundColor: '#f1f1f1', borderRadius: '12px' }}>
                <h4 className="text-center mb-4">Add Balance</h4>
                <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Enter amount (₼)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                />
                <div className="d-flex justify-content-between">
                    <button className="btn btn-secondary" onClick={() => navigate('/userprofile')}>Cancel</button>
                    <button className="btn btn-success" onClick={handleSubmit} disabled={!amount || parseFloat(amount) <= 0}>OK</button>
                </div>
            </div>
        </div>
    );
}

export default AddBalancePage;
