import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DeclinedPage = () => {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-danger bg-opacity-10">
            <div className="text-center border p-5 rounded shadow bg-white">
                <h2 className="text-danger mb-3">❌ Application Declined</h2>
                <p className="lead mb-4">
                    Unfortunately, your application as a dietitian has been declined.
                </p>
                <p className="text-muted mb-4">
                    If you believe this was a mistake or want further clarification, please contact the site administrator.
                </p>
                <a href="mailto:admin@behealthy.com" className="btn btn-danger">
                    📧 Contact Admin
                </a>
            </div>
        </div>
    );
};

export default DeclinedPage;
