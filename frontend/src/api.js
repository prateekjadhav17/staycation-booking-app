import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true, // Crucial for sending and receiving Passport session cookies
});

export default api;
