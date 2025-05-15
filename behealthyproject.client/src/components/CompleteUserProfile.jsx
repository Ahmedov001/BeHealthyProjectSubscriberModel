import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Snackbar, Alert } from '@mui/material';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from 'reactstrap';

function CompleteUserProfile() {
    const [age, setAge] = useState(null);
    const [height, setHeight] = useState(null);
    const [weight, setWeight] = useState(null);
    const [isComplete, setIsComplete] = useState();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();


    const handleSubmitProfile = async (ev) => {
        ev.preventDefault();
        const response = await fetch("https://localhost:7148/api/User/update-profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ age, height, weight })
        });
        if (response.ok) {

            setSnackbarMessage('Updated profile succesfull!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate("/userpage");
            }, 1500);
        } else {
            setSnackbarMessage('Invalid credentials.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    }




    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://localhost:7148/api/User/get-profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });


                if (response.ok) {
                    const data = await response.json();
                    if (data.isCompleteProfile) {
                        navigate("/userpage");
                        return;
                    }


                    setAge(data.age);
                    setHeight(data.height);
                    setWeight(data.weight);
                    setIsComplete(data.isComplete)

                } else {
                    alert("Invalid credentials.");
                }
                console.log(isComplete)



            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };


        fetchData();
    }, []);



    const handleBirthdayChange = (e) => {
        const birthDate = new Date(e.target.value);
        const currentDate = new Date();

        const age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDifference = currentDate.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
            setAge(age - 1);
        } else {
            setAge(age);
        }
    }

    return (
        <div className="signuppageimg">{!isComplete &&
            <div className="container d-flex justify-content-center align-items-center min-vh-100">

                <div className="col-md-8 col-lg-6 p-4 shadow-lg rounded bg-light">
                    <h2 className="text-center mb-4">Edit Profile</h2>
                    <Form onSubmit={handleSubmitProfile}>
                        <FormGroup>
                            <Label for="date">
                                Birthday
                            </Label>
                            <Input
                                id="date"
                                name="date"
                                placeholder="Birthday"
                                type="date"
                                onChange={handleBirthdayChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="height">Height (m)</Label>
                            <Input
                                id="height"
                                type="number"
                                step="0.01"
                                className="form-control"
                                placeholder="1.75"
                                min="50"
                                max="210"
                                value={height || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d*$/.test(value)) {
                                        setHeight(value);
                                    }
                                }}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                className="form-control"
                                placeholder="70"
                                max="250"
                                min="20"
                                value={weight || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d*$/.test(value)) {
                                        setWeight(value);
                                    }
                                }}
                                required
                            />
                        </FormGroup>
                        <Button className="btn btn-success w-100 py-2" type="submit">Submit</Button>
                    </Form>
                </div>
            </div>
        }
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

export default CompleteUserProfile;
