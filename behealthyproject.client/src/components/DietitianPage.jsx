import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DietitianNavbar from './DietitianNavbar';
function DietitianPage() {
    return (
        <>
            <DietitianNavbar />
            <div style={{ backgroundColor: '#2f343d' }} className="min-vh-100 text-white px-3 px-md-5 py-4">
            </div>
        </>
    );
}

export default DietitianPage;