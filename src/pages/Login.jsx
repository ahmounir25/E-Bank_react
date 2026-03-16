import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiService } from "../services/api";

const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(
            {
                ...formData,
                [e.target.name]: e.target.value
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {

            const response = await apiService.login(formData);

            if (response.data.StatusCode === 200) {
                apiService.saveAuthData(response.data.data.token, response.data.data.roles);
                navigate('/home');
            } else {
                setError(response.data.message || 'Login Failed')
            }


        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Login Failed')
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login to E-Bank</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-link">
                    Don't have an account ? <Link to="/register">Register</Link>
                    <br/>
                    Forgot your password ? <Link to="/forget-password">Reset Password</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;