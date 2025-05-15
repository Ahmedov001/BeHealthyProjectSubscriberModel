import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Snackbar, Alert } from '@mui/material';

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(true);
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [showPassword, setShowPassword] = useState(false);


    const navigate = useNavigate();

    const goToLoginPage = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isNicknameAvailable || !isEmailAvailable) {
            setSnackbarMessage('Email or Nickname is already use!!!');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const response = await fetch("https://localhost:7148/api/Auth/signup-user", {
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
                navigate("/");
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


    useEffect(() => {
        const delay = setTimeout(async () => {
            if (!email && !nickname) return;

            const params = new URLSearchParams();
            if (email) params.append("email", email);
            if (nickname) params.append("nickname", nickname);

            const res = await fetch(`https://localhost:7148/api/User/check-availability?${params.toString()}`);
            const data = await res.json();

            if (data.emailAvailable !== undefined) setIsEmailAvailable(data.emailAvailable);
            if (data.nicknameAvailable !== undefined) setIsNicknameAvailable(data.nicknameAvailable);
        }, 500);

        return () => clearTimeout(delay);
    }, [email, nickname]);

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="row w-100 shadow-lg rounded p-5 bg-white">
                <div className="col-md-12 text-center">
                    <h2 className="mb-4 display-6 fw-bold">User Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                className={`form-control ${nickname && !isNicknameAvailable ? 'is-invalid' : ''}`}
                                placeholder="Nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                required
                            />
                            {nickname && !isNicknameAvailable && (
                                <small className="text-danger text-start d-block">
                                    <FaTimesCircle className="me-1" /> Nickname already taken
                                </small>
                            )}
                        </div>


                        <div className="mb-4">
                            <input
                                type="email"
                                className={`form-control ${email && !isEmailAvailable ? 'is-invalid' : ''}`}
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {email && !isEmailAvailable && (
                                <small className="text-danger text-start d-block">
                                    <FaTimesCircle className="me-1" /> Email already registered
                                </small>
                            )}
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
                                        <li className="text-danger">
                                            <FaTimesCircle /> At least 8 characters
                                        </li>
                                    )}
                                    {!passwordValidation.hasNumber && (
                                        <li className="text-danger">
                                            <FaTimesCircle /> At least 1 number
                                        </li>
                                    )}
                                    {!passwordValidation.hasUpperCase && (
                                        <li className="text-danger">
                                            <FaTimesCircle /> At least 1 capital letter
                                        </li>
                                    )}
                                    {!passwordValidation.hasLowerCase && (
                                        <li className="text-danger">
                                            <FaTimesCircle /> At least 1 lowercase letter
                                        </li>
                                    )}
                                    {!passwordValidation.hasSpecialChar && (
                                        <li className="text-danger">
                                            <FaTimesCircle /> At least 1 special character
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>

                        <button type="submit" className="btn btn-success btn-lg w-100">Sign Up</button>
                    </form>
                    <button className="text-end btn btn-primary mt-3 mb-0" onClick={goToLoginPage}>If you have account</button>
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

export default SignUpPage;
