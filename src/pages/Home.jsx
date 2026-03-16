import { Link } from "react-router-dom";
import { apiService } from "../services/api";

const Home = () => {
    const isAuthenticated = apiService.isAuthenticated();
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to <span>E-Bank</span></h1>
                    <p>The smartest way to manage your finances in the digital age.</p>

                    {!isAuthenticated && (
                        <div className="hero-buttons">
                            <Link to="/register" className="btn btn-primary">Register</Link>
                            <Link to="/login" className="btn btn-secondary">Sign In</Link>
                        </div>
                    ) }
                </div>
            </section>
            <section className="features">
                <div className="container">
                    <h2>Why to Choose E-Bank ?</h2>
                    <div className="features-grid">
                        <div className="feature">
                            <div className="feature-icon">🛡️</div>
                            <h3>Secure Banking</h3>
                            <p>Multi-layer encryption and 2FA protection for every transaction.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">⚡</div>
                            <h3>Instant Transfers</h3>
                            <p>Send money to anyone, anywhere, in just a few seconds.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">📊</div>
                            <h3>Smart Analytics</h3>
                            <p>Track your spending habits with our intelligent visual tools.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
export default Home;