import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import DietitianNavbar from './DietitianNavbar';
import UserNavbar from './UserNavbar';

const DietitiansListForUser = () => {
    const [dietitians, setDietitians] = useState([]);
    const [subscribedDietitians, setSubscribedDietitians] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDietitianId, setSelectedDietitianId] = useState(null);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const fetchSubscribedDietitians = async () => {
            try {
                const response = await fetch("https://localhost:7148/api/User/get-subscribed-dietitians", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setSubscribedDietitians(data);
                } else {
                    alert("Failed to get subscribed dietitians.");
                }
            } catch (error) {
                console.error("Error fetching subscribed dietitians:", error);
            }
        };

        const fetchDietitians = async () => {
            try {
                const response = await fetch("https://localhost:7148/api/User/get-dietitians", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setDietitians(data);
                    fetchSubscribedDietitians();
                } else {
                    alert("Failed to get dietitians.");
                }
            } catch (error) {
                console.error("Error fetching dietitians:", error);
            }
        };

        fetchDietitians();
    }, [token]);

    const handleSubscribe = async (dietitianId, plan) => {
        try {
            const response = await fetch("https://localhost:7148/api/User/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ dietitianId, plan }),
            });

            if (response.ok) {
                setSubscribedDietitians(prev => [...prev, dietitianId]);
                setShowModal(false);
            } else {
                alert("Failed to subscribe.");
            }
        } catch (error) {
            console.error("Error subscribing:", error);
        }
    };

    const handleUnsubscribe = async (dietitianId) => {
        try {
            const response = await fetch("https://localhost:7148/api/User/unsubscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ dietitianId }),
            });

            if (response.ok) {
                setSubscribedDietitians(prev => prev.filter(id => id !== dietitianId));
            } else {
                alert("Failed to unsubscribe.");
            }
        } catch (error) {
            console.error("Error unsubscribing:", error);
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
            <Container className="mt-5" >
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
                                    </Card.Text>
                                    {subscribedDietitians.includes(d.id) ? (
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
                                },
                                {
                                    name: "Premium+",
                                    features: ["All features included", "Private one-on-one coaching", "Instant messaging support"],
                                }
                            ].map(plan => (
                                <Col key={plan.name} md={4}>
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
            </Container>
        </>

    );
};

export default DietitiansListForUser;
