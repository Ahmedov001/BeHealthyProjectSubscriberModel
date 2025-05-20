import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DietitianNavbar from './DietitianNavbar';
import React, { useEffect, useState } from 'react';
import {
    Table,
    Container,
    Spinner,
    Alert
} from 'reactstrap';

function DietitianPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetch("https://localhost:7148/api/Dietitian/get-subscribed-users", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to get users');
                }
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner color="light" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert color="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <div style={{ backgroundColor: '#2f343d', minHeight: '100vh' }}>
            <DietitianNavbar />
            <Container className="mt-5 text-white">
                <h3 className="mb-4">Subscribed Users</h3>
                {users.length === 0 ? (
                    <Alert color="info">You don't have subscribers.</Alert>
                ) : (
                    <Table bordered hover responsive dark>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </div>
    );
}

export default DietitianPage;
