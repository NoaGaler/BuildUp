import axios from 'axios';

// Create a centralized Axios instance with default configurations
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;