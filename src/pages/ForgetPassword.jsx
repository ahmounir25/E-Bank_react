import { apiService } from "../services/api";
import { Link } from "react-router-dom";
import { useState } from "react";

const ForgetPassword = () => {

    const [emailObj, setEmail] = useState(
        {
            email: ''
        }
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiService.forgetPassword(emailObj);

            if (response.data.StatusCode === 200) {
                setSuccess('Reset Code has been sent successfully');
                setEmail({ email: '' });
            } else {
                setError(response.data.message || 'Failed to Send The Email');
                setEmail({ email: '' });
            }

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to Send The Email');

        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Forgot Password</h2>
                <p className="auth-subtitle">Enter your email address to receive a password reset code</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={emailObj.email}
                            onChange={(e) => setEmail({ email: e.target.value })}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Code'}
                    </button>
                </form>

                <div className="auth-link">
                    Remember your password? <Link to="/login">Login</Link>
                </div>

                <div className="auth-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );


}

export default ForgetPassword;