import 'bootstrap/dist/css/bootstrap.min.css';

const Forbidden = () => (
    <div className="container text-center mt-5 ">
        <div className="card shadow p-4">
            <h2 className="text-danger">403 - Forbidden</h2>
            <p className="text-muted">You do not have permission to view this page.</p>
            <a href="/" className="btn btn-outline-primary mt-3">Go to Home</a>
        </div>
    </div>
);

export default Forbidden;
