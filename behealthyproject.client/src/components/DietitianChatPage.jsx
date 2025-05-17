import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Card } from 'react-bootstrap';
import * as signalR from '@microsoft/signalr';

const DietitianChatPage = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [connection, setConnection] = useState(null);

    const token = sessionStorage.getItem("token");
    const dietitianId = sessionStorage.getItem("userId");
    console.log(dietitianId)

    useEffect(() => {
        fetch("https://localhost:7148/api/Dietitian/get-subscribed-users", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setSubscribers(data))
            .catch(err => console.error("Failed to load users", err));
    }, [token]);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7148/hub/notifications", { accessTokenFactory: () => token })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, [token]);

    useEffect(() => {
        if (connection && connection.state === signalR.HubConnectionState.Connected) {
            connection.on("ReceiveMessage", (senderId, message) => {
                console.log("Received message from:", senderId, "msg:", message);

                if (senderId === selectedUser || senderId === dietitianId) {
                    setMessages(prev => [...prev, {
                        sender: senderId === userId ? "me" : senderId,
                        content: message
                    }]);
                }
            });
        }
    }, [connection]);

    useEffect(() => {
        if (selectedUser && dietitianId) {
            fetch(`https://localhost:7148/api/Chat/get-messages?user1Id=${dietitianId}&user2Id=${selectedUser}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setMessages(data.map(m => ({
                            sender: m.senderId === dietitianId ? "me" : m.senderId,
                            content: m.message
                        })));
                    } else {
                        console.error("API did not return an array", data);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [selectedUser]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText || !selectedUser) return;

        await fetch("https://localhost:7148/api/chat/send-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                receiverId: selectedUser,
                message: messageText
            })
        });

        setMessages(prev => [...prev, { sender: "me", content: messageText }]);
        setMessageText("");
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={4}>
                    <h5>Your Clients</h5>
                    <ListGroup>
                        {subscribers.map(u => (
                            <ListGroup.Item
                                action
                                key={u}
                                active={selectedUser === u}
                                onClick={() => setSelectedUser(u)}
                            >
                                {u}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col md={8}>
                    <h5>Chat</h5>
                    {selectedUser ? (
                        <Card>
                            <Card.Body style={{ height: "400px", overflowY: "auto" }}>
                                {messages
                                    .filter(msg => msg.sender === "me" || msg.sender === selectedUser)
                                    .map((msg, index) => (
                                        <div key={index} className={msg.sender === "me" ? "text-end" : "text-start"}>
                                            <strong>{msg.sender === "me" ? "You" : "Client"}:</strong> {msg.content}
                                        </div>
                                    ))}
                            </Card.Body>
                            <Card.Footer>
                                <Form className="d-flex" onSubmit={handleSendMessage}>
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
                        <p>Select a user to chat with.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default DietitianChatPage;
