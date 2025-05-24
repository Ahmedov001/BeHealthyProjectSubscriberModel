import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from 'react';
import { Spinner } from 'reactstrap';
import { Button } from 'reactstrap';
import { jwtDecode } from "jwt-decode";
import { Snackbar, Alert } from '@mui/material';
import { FaEye, FaEyeSlash } from "react-icons/fa";


function LoginPageUser() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const goToUserSignUp = () => {
        navigate('/signup/user');
    }
    const goToDietitianSignIn = () => {
        navigate('/signin/dietitian')
    }
    const goToResetPassword = () => {
        navigate('/resetpassword');
    }
    const setModal = () => {
        setShowModal(true);
    };
    const handleLoginUser = async (ev) => {
        ev.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const response = await fetch("https://localhost:7148/api/Auth/signin-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const result = await response.json();
                const token = result.token; 
                sessionStorage.setItem("token", token);

                const decoded = jwtDecode(token);
                const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                sessionStorage.setItem("role", role);
                sessionStorage.setItem("userId", result.userId);

                console.log("Token:", token);
                console.log("Role:", role);

                setSnackbarMessage('Login successful!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setTimeout(() => {
                    navigate("/completeuserprofile");
                }, 2000);

            } else {
                setSnackbarMessage('Invalid credentials.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }

        } finally {
            setLoading(false);
        }
    };

    const handleSubmitPasswordReset = async (e) => {
        e.preventDefault();

        const response = await fetch("https://localhost:7148/api/Auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            setSnackbarMessage('Sent mail');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            navigate("/resetpassword")
            setShowModal(false);
        } else {
            setSnackbarMessage('Failed to send mail. Please try again.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }

    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-dark homepage">
            <div className="row w-50 bg-body-secondary d-flex align-items-center justify-content-center " style={{
                height: "30rem",
                borderRadius: 55
            }}>
                <div className="col-md-6 text-center p-0 ">
                    <h2 className="mb-4 display-6 fw-bold">User</h2>
                    <form>
                        <div className="mb-4">
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Username"
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <div className="position-relative" style={{ height: "40px" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control h-100"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    role="button"
                                    aria-label={showPassword ? "�ifreyi gizle" : "�ifreyi g�ster"}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        right: "15px",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "gray",
                                        fontSize: "1.2rem"
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                    </form>
                    <div className="row mt-2">
                        <button className="btn btn-success w-100  col " onClick={handleLoginUser} disabled={loading}>
                            {
                                loading ? (
                                    <Button
                                        color="success"
                                        disabled
                                    >
                                        <Spinner size="sm">
                                            Loading...
                                        </Spinner>
                                        <span>  
                                            {' '}Loading
                                        </span>
                                    </Button>
                                ) : ("Sign In")
                            }

                        </button>
                        <p className="mt-0 mb-0 text-end col ">
                            <button onClick={setModal} className="btn btn-link text-dark">Forgot password</button>
                        </p>
                    </div>
                    <hr className="border border-dark border-2 opacity-100 mt-3 mb-2"></hr>

                    <p className="text-dark text-start m-0">
                        Don't have an account? <button onClick={goToUserSignUp} className="text-success fw-bold btn btn-link:focus ">Sign Up</button>
                    </p>
                    <p className="text-dark text-start m-0">
                        Login as<button onClick={goToDietitianSignIn} className="text-success fw-bold btn btn-link:focus">Dietitian</button>
                    </p>

                </div>

            </div>

            {showModal && (
                <div className="modal show" tabIndex="-1" style={{ display: 'block' }} aria-hidden="false">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Forgot password</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmitPasswordReset}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Enter email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success w-100">Send code</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && <div className="modal-backdrop fade show"></div>}
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

export default LoginPageUser;