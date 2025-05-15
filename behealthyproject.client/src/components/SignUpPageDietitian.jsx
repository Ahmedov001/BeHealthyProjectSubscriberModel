import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import { FaTimesCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function SignUpPageDietitian() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [showPassword, setShowPassword] = useState(false);
  
    const goToDietitianLoginPage = () => {
        navigate('/signin/dietitian');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
 
        const response = await fetch("https://localhost:7148/api/Auth/signup-dietitian", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, nickname, email, password })
        });

        if (response.ok) {
            setSnackbarMessage('Register successful!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate("/signin/dietitian");
            }, 2000);
        } else {
            setSnackbarMessage('Invalid credentials.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const passwordValidation = {
        minLength: password.length >= 8,
        hasNumber: /\d/.test(password),
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_+\-=\\[\]\/`~;:<>]/.test(password),
    };



    return (
        <div className="signuppageimg">
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="row w-100 shadow-lg rounded p-5 bg-white">
                    <div className="col-md-12 text-center">
                        <h2 className="mb-4 display-4 fw-bold">Dietitian Sign Up</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <input type="text" className="form-control" placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                            </div>
                            <div className="mb-4">
                                <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            <div className="mb-4 position-relative" style={{ height: "40px" }}>
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

                            {password && !Object.values(passwordValidation).every(Boolean) && (
                                <ul className="list-unstyled mt-2 ps-3 text-start">
                                    {!passwordValidation.minLength && (
                                        <li className="text-danger"><FaTimesCircle /> At least 8 characters</li>
                                    )}
                                    {!passwordValidation.hasNumber && (
                                        <li className="text-danger"><FaTimesCircle /> At least 1 number</li>
                                    )}
                                    {!passwordValidation.hasUpperCase && (
                                        <li className="text-danger"><FaTimesCircle /> At least 1 capital letter</li>
                                    )}
                                    {!passwordValidation.hasLowerCase && (
                                        <li className="text-danger"><FaTimesCircle /> At least 1 lowercase letter</li>
                                    )}
                                    {!passwordValidation.hasSpecialChar && (
                                        <li className="text-danger"><FaTimesCircle /> At least 1 special character</li>
                                    )}
                                </ul>
                            )}

                            <button type="submit" className="btn btn-success btn-lg w-100">Sign Up</button>
                        </form>
                        <button className="text-end btn btn-primary mt-3 mb-0" onClick={goToDietitianLoginPage}>If you have account</button>
                    </div>
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

export default SignUpPageDietitian;
