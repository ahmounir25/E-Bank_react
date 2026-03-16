import { apiService } from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const UpdatePassword = () => {

    const [updatePassData, setUpdatePassData] = useState(
        {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validateErrors, setValidateErrors] = useState({});

    const navigate = useNavigate();

    const handlePassChange = (event) => {
        const { name, value } = event.target;

        setUpdatePassData(
            {
                ...updatePassData,
                [name]: value
            }
        )

        if (validateErrors[name]) {
            setValidateErrors({
                ...validateErrors,
                [name]: ''
            })
        }
    }

    const validateForm = () => {
        const errors = {}
        if (!updatePassData.oldPassword) {
            errors.oldPassword = 'required';
        }
        if (!updatePassData.newPassword) {
            errors.newPassword = 'required';
        } else if (updatePassData.newPassword.length < 9) {
            errors.newPassword = 'Password must be at least 9 characters';
        }
        if (!updatePassData.confirmPassword) {
            errors.confirmPassword = 'required';
        } else if (updatePassData.newPassword !== updatePassData.confirmPassword) {
            errors.confirmPassword = 'Passwords don\'t match';
        }

        setValidateErrors(errors);
        return Object.keys(errors).length === 0;
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await apiService.updatePassword(
                updatePassData.oldPassword,
                updatePassData.newPassword
            );
            if (response.data.StatusCode === 200) {
                setSuccess('Password Updated Successfully');
                setUpdatePassData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setTimeout(
                    () => {
                        navigate('/profile');
                    }, 3000
                )

            } else {
                setError(response.data.message || 'Failed to Update Password');

            }

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to Update Password');
        } finally {
            setLoading(false);
        }
    }



    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Change Password</h1>
            </div>
            <div className="update-profile-content">
                <div className="password-update-section">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form className="password-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="oldPassword">Current Password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                id="oldPassword"
                                className={validateErrors.oldPassword ? 'error' : ''}
                                value={updatePassData.oldPassword}
                                onChange={handlePassChange}
                                placeholder="Enter current password"
                            />
                            {validateErrors.oldPassword && (
                                <span className="field-error">{validateErrors.oldPassword}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                className={validateErrors.newPassword ? 'error' : ''}
                                value={updatePassData.newPassword}
                                onChange={handlePassChange}
                                placeholder="New Password"
                            />
                            {validateErrors.newPassword && (
                                <span className="field-error">{validateErrors.newPassword}</span>
                            )}
                        </div>


                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className={validateErrors.confirmPassword ? 'error' : ''}
                                value={updatePassData.confirmPassword}
                                onChange={handlePassChange}
                                placeholder="Confirm new password"
                            />
                            {validateErrors.confirmPassword && (
                                <span className="field-error">{validateErrors.confirmPassword}</span>
                            )}
                        </div>

                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/profile')}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );



}

export default UpdatePassword;

