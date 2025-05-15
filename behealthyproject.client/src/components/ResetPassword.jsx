import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const navigate = useNavigate();
    const HandleResetPassword = async (ev) => {
        ev.preventDefault();
        const response = await fetch("https://localhost:7148/api/Auth/reset-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, resetCode, newPassword })
        });

        if (response.ok) {
            setSnackbarMessage('Login successful!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate("/");
            }, 1500);

        } else {
            setSnackbarMessage('Invalid credentials.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };


    return (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="row w-100 h-100 shadow-lg rounded p-5 bg-white d-flex align-items-center justify-content-center">
                <div className="col-md-6 text-center border-end p-5">
                    <h2 className="mb-4 display-4 fw-bold">Reset Password</h2>
                    <form>
                        <div className="mb-4">
                            <input
                                type="email"
                                className="form-control form-control-lg"
                                placeholder="Email"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="6-digit code"
                                onChange={e => setResetCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                placeholder="New password"
                                onChange={e => setNewPassword(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary btn-lg w-100" onClick={HandleResetPassword}>Reset</button>
                    </form>
                </div>
            </div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{
                        width: '100%',
                        fontSize: '1.25rem',
                        padding: '16px',
                        textAlign: 'center',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default ResetPassword;