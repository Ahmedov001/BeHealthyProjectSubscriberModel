import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PendingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("https://localhost:7148/hub/notifications", {
                accessTokenFactory: () => sessionStorage.getItem("token") 
            })
            .withAutomaticReconnect()
            .build();

        connection.start().then(() => {
            console.log("SignalR connected");

            connection.on("ReceiveApproval", (status) => {
                if (status === "approved") {
                    navigate("/createprogram");
                } else if (status === "declined") {
                    navigate("/declinedpage");
                }
            });
        });

        return () => {
            connection.stop();
        };
    }, []);
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-warning bg-opacity-10">
            <div className="text-center border p-5 rounded shadow bg-white">
                <h2 className="text-warning mb-3">⏳ Approval Pending</h2>
                <p className="lead mb-4">
                    Your account is currently under review by our team. You will be notified once it is approved.
                </p>
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default PendingPage;
