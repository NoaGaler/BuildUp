import axios from 'axios';

// Create a centralized Axios instance with default configurations
const api = axios.create({
    baseURL: 'https://app-d4e09bdc-bc2d-426d-90c4-78f353c66442.cleverapps.io/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            window.dispatchEvent(new Event('auth-unauthorized'));
        }
        return Promise.reject(error);
    }
);

export default api;