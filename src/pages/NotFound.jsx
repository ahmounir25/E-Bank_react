
import { Link } from "react-router-dom";

const NotFound = () => {

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-animation">
                    <div className="not-found-number">4</div>
                    <div className="not-found-zero">
                        <div className="not-found-inner-circle"></div>
                    </div>
                    <div className="not-found-number">4</div>
                </div>
                <h1 className="not-found-title">Page Not Found</h1>
                <br />
                <p className="not-found-message">
                    The page you are looking for doesn't exist or has been moved.
                    Don't worry, your funds are safe! Let's get you back to your account.
                </p>
                <div className="not-found-actions">
                    <Link to="/home" className="btn btn-primary">
                        Home
                    </Link>
                    <button onClick={() => window.history.back()} className="btn btn-secondary">
                        Back
                    </button>
                </div>
            </div>

        </div>
    );
}

export default NotFound;