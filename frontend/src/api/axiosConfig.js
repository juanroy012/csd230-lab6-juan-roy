import axios from 'axios';
const api = axios.create({
    baseURL: '/api/rest'
});

// Axios Interceptor: Runs right before ANY request is sent
api.interceptors.request.use(
    (config) => {
        // Dynamically grab the token right when the request fires
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const requestUrl = String(error?.config?.url || '');
        const isLoginCall = requestUrl.includes('/auth/login');

        if ((status === 401 || status === 403) && !isLoginCall) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login?expired=true';
        }

        return Promise.reject(error);
    }
);

export default api;