import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import UserNavbar from './UserNavbar';
import { Snackbar, Alert } from '@mui/material';

const DietitiansListForUser = () => {
    const [dietitians, setDietitians] = useState([]);
    const [subscribedDietitians, setSubscribedDietitians] = useState([]);
    const [userBalance, setUserBalance] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [selectedDietitianId, setSelectedDietitianId] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [showPassword, setShowPassword] = useState(false);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        await fetchDietitians();
        await fetchSubscribedDietitians();
        await fetchUserBalance();
    };

    const fetchDietitians = async () => {
        try {
            const response = await axios.get("https://localhost:7148/api/User/get-dietitians", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDietitians(response.data);
        } catch (error) {
            console.error("Error fetching dietitians:", error);
            alert("Failed to get dietitians.");
        }
    };

    const fetchSubscribedDietitians = async () => {
        try {
            const response = await axios.get("https://localhost:7148/api/User/get-subscribed-dietitians", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSubscribedDietitians(response.data);
        } catch (error) {
            console.error("Error fetching subscribed dietitians:", error);
            alert("Failed to get subscribed dietitians.");
        }
    };

    const fetchUserBalance = async () => {
        try {
            const response = await axios.get("https://localhost:7148/api/User/get-user-balance", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserBalance(response.data);
        } catch (error) {
            console.error("Error fetching user balance:", error);
            alert("Failed to fetch user balance.");
        }
    };

    const handleSubscribe = async (dietitianId, plan) => {
        const selected = dietitians.find(d => d.id === dietitianId);
        const price = selected?.price ?? 0;

        if (userBalance < price) {
            setSnackbarMessage('You do not have enough balance to subscribe.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await axios.post("https://localhost:7148/api/User/subscribe", {
                dietitianId,
                plan,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status >= 200 && response.status < 300) {
                setSubscribedDietitians(prev => [...prev, { id: dietitianId }]);
                setUserBalance(response.data.newBalance ?? userBalance - price);
                setShowModal(false);
                setSnackbarMessage('Successfully subscribed!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
            } else {
                throw new Error('Unexpected response status');
            }
        } catch (error) {
            console.error("Error subscribing:", error);
            setSnackbarMessage("Failed to subscribe.");
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleUnsubscribe = async (dietitianId) => {
        try {
            const response = await axios.post("https://localhost:7148/api/User/unsubscribe", {
                dietitianId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status >= 200 && response.status < 300) {
                setSnackbarMessage('Successfully unsubscribed!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setSubscribedDietitians(prev => prev.filter(d => d.id !== dietitianId));
            }
        } catch (error) {
            console.error("Error unsubscribing:", error);
            alert("Failed to unsubscribe.");

        }
    };

    const handleOpenModal = (dietitianId) => {
        setSelectedDietitianId(dietitianId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDietitianId(null);
    };

    return (
        <>
            <UserNavbar />
            <Container className="mt-5">
                <h4 className="mb-4">Your Balance: ${userBalance.toFixed(2)}</h4>
                <Row>
                    {dietitians.map(d => (
                        <Col key={d.id} sm={12} md={6} lg={4} className="mb-4">
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>{d.username}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{d.nickname}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Experience:</strong> {d.experience} years<br />
                                        <strong>Certification:</strong> {d.certifications?.join(', ')}<br />
                                        <strong>Specialization:</strong> {d.specialization}<br />
                                        <strong>Price:</strong> ${d.price?.toFixed(2)}
                                    </Card.Text>
                                    {subscribedDietitians.some(sub => sub.id === d.id) ? (
                                        <Button className="mt-2" variant="secondary" onClick={() => handleUnsubscribe(d.id)}>
                                            Unsubscribe
                                        </Button>
                                    ) : (
                                        <Button className="mt-2" onClick={() => handleOpenModal(d.id)}>
                                            Subscribe
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title className="fs-4">Choose a Subscription Plan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="g-4">
                            {[
                                {
                                    name: "Standard",
                                    features: ["1 hour daily communication", "Access to diet program"],
                                },
                                {
                                    name: "Premium",
                                    features: ["6 hours daily communication", "Access to all diet programs"],
                                }
                            ].map(plan => (
                                <Col key={plan.name} md={6}>
                                    <Card className="text-center h-100 shadow-lg">
                                        <Card.Body className="d-flex flex-column justify-content-between p-4">
                                            <Card.Title className="fs-3 mb-3">{plan.name}</Card.Title>
                                            <ul className="text-start fs-6 mb-4">
                                                {plan.features.map((f, i) => (
                                                    <li key={i}>{f}</li>
                                                ))}
                                            </ul>
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                onClick={() => handleSubscribe(selectedDietitianId, plan.name)}
                                            >
                                                Select
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Modal.Body>
                </Modal>
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
            </Container>
        </>
    );
};

export default DietitiansListForUser;
