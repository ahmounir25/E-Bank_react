import { apiService } from "../services/api";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";


const ResetPassword = () => {
    const [formData, setFormData] = useState({
        code: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    useEffect(() => {

        const codeFromUrl = searchParams.get('code');

        if (codeFromUrl) {
            setFormData(prev => (
                {
                    ...prev,
                    code:codeFromUrl
                }
            )
        );
        }
    }, [searchParams]);


    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');


        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords don\'t match');
            setLoading(false);
            return;
        }
        if (formData.newPassword.length < 9) {
            setError('Password must be at least 9 characters');
            setLoading(false);
            return;
        }
        try {
            const response = await apiService.resetPassword({
                code: formData.code,
                newPass: formData.newPassword
            });

            if (response.data.StatusCode === 200) {
                setSuccess('Password Reseted Successfully');
                setTimeout(
                    () => {
                        navigate('/login');
                    }, 3000
                );
            }else{
                setError(response.data.message || 'Failed to Reset Password');
            }

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to Reset Password');
        } finally {
            setLoading(false);
        }
    }


     return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Reset Password</h2>
                <p className="auth-subtitle">Enter your reset code and new password</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="code">Reset Code</label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="Enter the code sent to your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter a new password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="auth-link">
                    Need a new code? <Link to="/forget-password">Send again</Link>
                </div>

                <div className="auth-link">
                    Remember your password? <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );

}

export default ResetPassword;