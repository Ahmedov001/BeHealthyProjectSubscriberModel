import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

function UserNavbar() {
    return (
        <Navbar expand="lg" className="sticky-top w-100 m-0 p-0 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
            <div className="w-100 d-flex justify-content-between align-items-center px-4 py-2">
                <Navbar.Brand href="/userpage" className="fw-bold text-success fs-4 m-0 mx-3">
                    BeHealthy
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="user-navbar-nav" />
                <Navbar.Collapse id="user-navbar-nav">
                    <Nav className="d-flex gap-3">
                        <Nav.Link href="/userpage" className="text-dark fw-semibold">Home</Nav.Link>
                        <Nav.Link href="/userprofile" className="text-dark fw-semibold">Profile</Nav.Link>
                        <Nav.Link href="/userchat" className="text-dark fw-semibold">Chat</Nav.Link>
                        <Nav.Link href="/dietitianslist" className="text-dark fw-semibold">Dietitians</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default UserNavbar;
