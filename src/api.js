const axios = require('axios');

// Outside of a local environment, this should be changed
axios.defaults.baseURL = 'http://localhost:8000/api/';

export function login({ email, password })
{
    return axios.post('/login', {email, password})
        .then(response => {
            if (response.data.success) {
                let token = response.data.token;
                if (!token) {
                    console.error('No token provided in login response data: ', response.data);
                } else {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
                return response;
            }
        });
}

export function logout()
{
    return axios.post('/logout')
        .then(response => {
            if (response.data.success) {
                delete axios.defaults.headers.common['Authorization'];
                return response;
            }
        });
}

export function register({ email, name, password, password_confirmation })
{
    return axios.post('/register', {email, name, password, password_confirmation})
        .then(response => {
            if (response.data.success) {
                let token = response.data.token;
                if (!token) {
                    console.error('No token provided in register response data: ', response.data);
                } else {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
                return response;
            }
            console.error('Registration unsuccessful: ', response.data);
        });
}
