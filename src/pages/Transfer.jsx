import { useState, useEffect } from "react";
import { apiService } from "../services/api";

const Transfer = () => {

    const [formData, setFormData] = useState({
        amount: 0,
        sourceAccount: '',
        destinationAccount: ''
    });

    const [userAccounts, setUserAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUserAccounts = async () => {
            try {
                const response = await apiService.getMyAccounts();
                if (response.data.StatusCode === 200) {
                    setUserAccounts(response.data.data);
                    if (response.data.data.length > 0) {
                        setFormData(prev => (
                            {
                                ...prev,
                                sourceAccount: response.data.data[0].accountNumber
                            }
                        )
                        );

                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserAccounts();
    }, []);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(
            {
                ...formData,
                [name]: value
            }
        )
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!formData.destinationAccount || !formData.amount) {
            setError('Please fill all required fields');
            setLoading(false);
            return;
        }
        if (parseFloat(formData.amount) <= 0) {
            setError('Amount must be greater than 0 ');
            setLoading(false);
            return;
        }

        if (formData.destinationAccount === formData.sourceAccount) {
            setError('You can\'t transfer money to your self');
            setLoading(false);
            return;
        }
        try {
            const transferData = {
                transactionType: 'TRANSFER',
                amount: parseFloat(formData.amount),
                accountNumber: formData.sourceAccount,
                destinationAccountNumber: formData.destinationAccount
            }
            const response = await apiService.makeTransfer(transferData);
            if (response.data.StatusCode === 200) {
                setSuccess('Transfer Completed Successfully')
                setFormData({
                    amount: 0,
                    sourceAccount: '',
                    destinationAccouunt: ''
                });
                setTimeout(() => { window.location.reload(); }, 2000);
            } else {
                setError(response.data.message || 'Can\'t make the transfer right now');

            }

        } catch (error) {
            setError(error.response?.data?.message || 'Can\'t make the transfer right now');

        } finally {
            setLoading(false);
        }
    }

   return (
        <div className="transfer-container">
            <div className="transfer-header">
                <h1>Make a Transfer</h1>
            </div>

            <div className="transfer-content">

                <div className="transfer-form-section">

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <form onSubmit={handleSubmit} className="transfer-form">
                        <div className="form-group">
                            <label htmlFor="sourceAccount">From Account</label>
                            <select
                                id="sourceAccount"
                                name="sourceAccount"
                                value={formData.sourceAccount}
                                onChange={handleChange}
                                required
                            >
                                {userAccounts.map(account => (
                                    <option key={account.id} value={account.accountNumber}>
                                        {account.accountNumber} - {account.accountType} ({account.currency} {account.balance.toFixed(2)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="destinationAccount">Destination Account Number *</label>
                            <input
                                type="text"
                                id="destinationAccount"
                                name="destinationAccount"
                                value={formData.destinationAccount}
                                onChange={handleChange}
                                placeholder="Enter destination account number"
                                required
                            />
                        </div>
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
                            className="btn btn-primary transfer-btn"
                            disabled={loading}
                        >
                            {loading ? 'Processing Transfer...' : 'Transfer Money'}
                        </button>
                    </form>
                </div>

                <div className="transfer-guidelines">
                    <h3>Transfer Guidelines</h3>
                    <ul>
                        <li>Transfers are processed instantly</li>
                        <li>Ensure the destination account number is correct</li>
                        <li>Double-check the amount before confirming</li>
                        <li>Transfers cannot be reversed once processed</li>
                        <li>Contact support if you encounter any issues</li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default Transfer;