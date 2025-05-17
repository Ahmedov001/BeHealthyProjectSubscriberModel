import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

function DietitianNavbar() {
    return (
        <Navbar expand="lg" className="sticky-top w-100 m-0 p-0 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
            <div className="w-100 d-flex justify-content-between align-items-center px-4 py-2">
                <Navbar.Brand href="/dietitianpage" className="fw-bold text-success fs-4 m-0 mx-3 ">
                    BeHealthy
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="dietitian-navbar-nav" />
                <Navbar.Collapse id="dietitian-navbar-nav">
                    <Nav className="d-flex gap-4">
                        <Nav.Link href="/dietitianpage" className="text-dark fw-semibold">Home</Nav.Link>
                        <Nav.Link href="/dietitianprofile" className="text-dark fw-semibold">Profile</Nav.Link>
                        <Nav.Link href="/dietitianchat" className="text-dark fw-semibold">Chat</Nav.Link>
                        <Nav.Link href="/subscribedusers" className="text-dark fw-semibold">Users</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}

export default DietitianNavbar;
