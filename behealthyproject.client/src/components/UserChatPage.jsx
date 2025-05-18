import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Card } from 'react-bootstrap';
import * as signalR from '@microsoft/signalr';
import { jwtDecode } from "jwt-decode";
import UserNavbar from './UserNavbar';

const UserChatPage = () => {
    const [subscribedDietitians, setSubscribedDietitians] = useState([]);
    const [selectedDietitian, setSelectedDietitian] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [connection, setConnection] = useState(null);
    const messagesEndRef = useRef(null);


    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);




    useEffect(() => {
        fetch("https://localhost:7148/api/User/get-subscribed-dietitians", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => setSubscribedDietitians(data), console.log)
            .catch(err => console.error("Failed to load dietitians", err));
    }, [token]);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7148/hub/notifications", {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, [token]);

    useEffect(() => {
        if (connection) {
            if (connection.state !== signalR.HubConnectionState.Connected) {
                connection
                    .start()
                    .then(() => console.log("SignalR connected"))
                    .catch(err => console.error("SignalR connection fail:", err));
            }

            connection.off("ReceiveMessage");

            connection.on("ReceiveMessage", (senderId, message) => {
                console.log("New Message:", senderId, message);

                if (senderId === selectedDietitian || senderId === userId) {
                    setMessages(prev => [
                        ...prev,
                        {
                            sender: senderId === userId ? "me" : senderId,
                            content: message
                        }
                    ]);
                }
            });
        }
    }, [connection, selectedDietitian]);

    useEffect(() => {
        if (selectedDietitian && userId) {
            fetch(`https://localhost:7148/api/Chat/get-messages?user1Id=${userId}&user2Id=${selectedDietitian}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setMessages(data.map(m => ({
                            sender: m.senderId === userId ? "me" : m.senderId,
                            content: m.message
                        })));
                    } else {
                        console.error("Invalid message data:", data);
                    }
                })
                .catch(err => console.error("Error fetching messages:", err));
        }
    }, [selectedDietitian]);    

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText || !selectedDietitian) return;
        await fetch("https://localhost:7148/api/Chat/send-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                receiverId: selectedDietitian,
                message: messageText
            })
        });

        setMessages(prev => [...prev, { sender: "me", content: messageText }]);
        setMessageText("");
    };

    const handleSelectDietitian = (dietitian) => {
        setSelectedDietitian(dietitian);
        setMessages([]);
    };

    return (<>
        <UserNavbar />
        <Container className="mt-4">
            <Row>
                <Col md={4}>
                    <h5>Your Subscriptions</h5>
                    <ListGroup>
                        {subscribedDietitians.map(d => (
                            <ListGroup.Item
                                action
                                key={d}
                                active={selectedDietitian?.id === d.id}
                                onClick={() => handleSelectDietitian(d)}
                            >
                                {d}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col md={8}>
                    <h5>Chat with {selectedDietitian?.username}</h5>
                    {selectedDietitian ? (
                        <Card>
                            <Card.Body style={{ height: "400px", overflowY: "auto" }}>
                                {messages
                                    .filter(msg => msg.sender === "me" || msg.sender === selectedDietitian)
                                    .map((msg, index) => (
                                        <div key={index} className={msg.sender === "me" ? "text-end" : "text-start"}>
                                            <strong>{msg.sender === "me" ? "You" : "Dietitian"}:</strong> {msg.content}
                                        </div>
                                    ))}
                                <div ref={messagesEndRef}></div>
                            </Card.Body>
                            <Card.Footer>
                                <Form onSubmit={handleSendMessage} className="d-flex">
                                    <Form.Control
                                        type="text"
                                        placeholder="Type your message..."
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                    />
                                    <Button type="submit" className="ms-2">Send</Button>
                                </Form>
                            </Card.Footer>
                        </Card>
                    ) : (
                        <p>Select a dietitian to chat with.</p>
                    )}
                </Col>
            </Row>
        </Container>
    </>
    );
};

export default UserChatPage;
