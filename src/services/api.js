import axios from "axios";

const API_BASE_URL = "http://13.60.41.226:8081/api";

// create axios instance
const api = axios.create(
    {
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json'
        },
    }
);
// add token to request if available 
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);

// api methods

export const apiService =
{
    saveAuthData: (token, roles) => {
        localStorage.setItem('token', token)
        localStorage.setItem('roles', JSON.stringify(roles))

    },
    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('roles')

    },
    hasRole(role) {
        const roles = localStorage.getItem('roles');
        return roles ? JSON.parse(roles).includes(role) : false;
    },
    isAuthenticated: () => {
        return localStorage.getItem('token') !== null;
    },
    isAdmin() {
        return this.hasRole('ADMIN');
    },
    isAuditor() {
        return this.hasRole('AUDITOR');
    },
    isCustomer() {
        return this.hasRole('CUSTOMER');
    },
    login: (body) => {
        return api.post('/auth/login', body);
    },
    register: (body) => {
        return api.post('/auth/register', body);
    },
    forgetPassword: (body) => {
        return api.post('/auth/forget-password', body);
    },
    resetPassword: (body) => {
        return api.post('/auth/reset-password', body);
    },
    getMyProfile: () => {
        return api.get('/users/profile');
    },
    updatePassword: (oldPass, newPass) => {
        return api.put
            ('/users/update-password',
                {
                    oldPassword: oldPass,
                    newPassword: newPass
                }
            );
    },
    uploadPicture: (file) => {

        const formData = new FormData();
        formData.append('file', file);

        return api.put('/users/profile-picture'
            , formData
            , {
                headers:
                {
                    "Content-Type": 'multipart/form-data',
                }
            }
        );
    },

    deletePicture: (url) => {
        return api.delete('/users/profile-picture', {
            params: {
                url: url
            }
        });
    },

    // ACCOUNT
    getMyAccounts: () => {
        return api.get('/accounts/me');
    },
    makeTransfer: (transferData) => {
        return api.post('/transactions/create', transferData);

    },
    makeDeposit: (depositData) => {
        return api.post('/transactions/create', depositData);

    },
    getTransactions: (accountNum, page = 0, size = 4) => {
        return api.get(`/transactions/${accountNum}?page=${page}&size=${size}`);

    },

    // For ADMIN , AUDITOR
    getAllTransactions: (page = 0, size = 4) => {
        return api.get(`/transactions/all?page=${page}&size=${size}`);

    },


    //AUDITOR
    getSystemTotals: () => {
        return api.get('/audit/totals');
    },
    findUserByemail: (email) => {
        return api.get(`/audit/users?email=${email}`);
    },
    findAccountByNum: (accountNumber) => {
        return api.get(`/audit/accounts?accountNum=${accountNumber}`);
    },
    findTransactionByAccountNum: (accountNumber) => {
        return api.get(`/audit/transactions/by-account?accountNum=${accountNumber}`);
    },
    findTransactionById: (id) => {
        return api.get(`/audit/transactions/by-id?id=${id}`);
    }


}

export default api;

