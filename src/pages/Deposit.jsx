import { useState, useEffect } from "react";
import { apiService } from "../services/api";

const Deposit = () => {

    const [formData, setFormData] = useState({
        accountNumber: '',
        amount: '',
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [accountInfo, setAccountInfo] = useState(null);

    const handleChange = (event) => {
        setFormData(
            {
                ...formData,
                [event.target.name]: event.target.value
            }
        );
    }
    const searchAccount = async () => {
        if (!formData.accountNumber.trim()) {
            setError('Please Enter an Account Number');
            return;
        }
        setSearchLoading(true);
        setError('');
        setAccountInfo(null);

        try {
            const response = await apiService.findAccountByNum(formData.accountNumber)
            const account = response.data || [];
            if (account.accountNumber) {
                setAccountInfo(account);
                setSuccess(`Account Found : ${account.accountType}  Account -${account.accountNumber}`);
                fetchRecentTransactions();
            } else {
                setError(response.data.message || "can'\t search right now");
            }
        } catch (error) {
            setError(error.response?.data?.message || "can'\t search right now");
        } finally {
            setSearchLoading(false);
        }
    }

    const fetchRecentTransactions = async () => {
        try {
            if (formData.accountNumber) {
                const response = await apiService.getTransactions(formData.accountNumber, 0, 3);
                if (response.data.StatusCode === 200) {
                    setRecentTransactions(response.data.data || []);
                }
            }

        } catch (error) {
            console.error('Error fetching data : ', error);
        }
    }
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();

    }
    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-Us', {
            style: 'currency',
            currency: currency,

        }).format(amount);
    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!formData.accountNumber.trim()) {
            setError('Account number is required');
            setLoading(false);
            return;
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount greater than 0');
            setLoading(false);
            return;
        }

        try {
            const depositData = {
                transactionType: 'DEPOSIT',
                amount: parseFloat(formData.amount),
                accountNumber: formData.accountNumber,
            };

            const response = await apiService.makeDeposit(depositData);

            if (response.data.statusCode === 200) {
                setSuccess(`Successfully deposited $${formData.amount} to account ${formData.accountNumber}`);

                setFormData({
                    accountNumber: formData.accountNumber,
                    amount: '',
                    description: ''
                });

                fetchRecentTransactions();

                setTimeout(() => {
                    setSuccess('');
                }, 4000);
            } else {
                setError(response.data.message || 'Deposit failed');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred during deposit');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="admin-deposit-container">
            <div className="admin-deposit-header">
                <h2>Deposit funds into customer accounts</h2>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="deposit-content">
                <div className="deposit-form-section">
                    <div className="form-card">
                        <h2>Make Deposit</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="accountNumber">Account Number *</label>
                                <div className="input-with-button">
                                    <input
                                        type="text"
                                        id="accountNumber"
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                        placeholder="Enter customer account number"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={searchAccount}
                                        disabled={searchLoading}
                                    >
                                        {searchLoading ? 'Searching...' : 'Verify'}
                                    </button>
                                </div>
                            </div>

                            {accountInfo && (
                                <div className="account-info">
                                    <h4>Account Information</h4>
                                    <div className="account-details">
                                        <p><strong>Type:</strong> {accountInfo.accountType}</p>
                                        <p><strong>Balance:</strong> {formatCurrency(accountInfo.balance, accountInfo.currency)}</p>
                                        <p><strong>Status:</strong> <span className={`status ${accountInfo.accountStatus.toLowerCase()}`}>{accountInfo.accountStatus}</span></p>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="amount">Amount *</label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary deposit-btn"
                                disabled={loading || !accountInfo}
                            >
                                {loading ? 'Processing Deposit...' : 'Deposit'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="recent-transactions-section">
                    <div className="transactions-card">
                        <h2>Recent Deposits</h2>
                        {recentTransactions.length > 0 ? (
                            <div className="transactions-list">
                                {recentTransactions
                                    .filter(tx => tx.transactionType === 'DEPOSIT')
                                    .slice(0, 5)
                                    .map(transaction => (
                                        <div key={transaction.id} className="transaction-item">
                                            <div className="transaction-main">
                                                <div className="transaction-type deposit">DEPOSIT</div>
                                                <div className="transaction-amount">
                                                    +{formatCurrency(transaction.amount)}
                                                </div>
                                            </div>
                                            <div className="transaction-details">
                                                <div className="transaction-date">
                                                    {formatDate(transaction.transactionDate)}
                                                </div>
                                                <div className="transaction-account">
                                                    Account: {transaction.sourceAccount || formData.accountNumber}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="no-transactions">
                                <p>No recent deposits found</p>
                                <p className="hint">Recent deposits will appear here after transactions</p>
                            </div>
                        )}
                    </div>

                    <div className="guidelines-card">
                        <h3>Deposit Guidelines</h3>
                        <ul>
                            <li>Verify account number before processing deposits</li>
                            <li>Ensure amount is correct and properly formatted</li>
                            <li>Provide clear description for audit purposes</li>
                            <li>Double-check all information before submitting</li>
                            <li>Keep records of all deposit transactions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default Deposit;