import 'bootstrap/dist/css/bootstrap.min.css';

const Unauthorized = () => (
    <div className="unauthorizeimg">
        <div className="container text-center mt-5">
            <div className="mt-5">
                <p className="text-white" style={
                    {
                        marginTop: "18em",
                        marginLeft:"1em",
                        fontSize:"23px"
                    }
                }>Unauthorized - You must log in to view this page.</p>
                <a href="/" className="btn btn-success ">Login</a>
            </div>
        </div>
    </div>
);

export default Unauthorized;
