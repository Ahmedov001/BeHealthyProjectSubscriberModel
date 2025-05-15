import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
function DietitianPage() {
    return (
        <div style={{ backgroundColor: '#2f343d' }} className="min-vh-100 text-white p-4">
            <nav className="navbar navbar-expand navbar-dark mb-4" style={{ backgroundColor: '#1f232b' }}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="/dietitianpage">BeHealthy</a>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row gap-3">
                        <li className="nav-item"><a className="nav-link active" href="/dietitianpage">Home</a></li>
                        <li className="nav-item"><a className="nav-link" href="/dietitianprofile">Profile</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Posts</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Dietitians</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default DietitianPage;