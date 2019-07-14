import axios from 'axios';

export function setToken(token)
{
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
}

export function login({ email, password })
{
    return axios.post('/api/login', { email, password })
        .then(response => {
            if (response.data.success) {
                let token = response.data.token;
                if (!token) {
                    console.error('No token provided in login response data: ', response.data);
                } else {
                    setToken(token);
                }
                return response.data;
            }
            console.error('Could not login');
        });
}

export function user()
{
    return axios.get('/api/user')
        .then(response => {
            if (response.data) {
                return response.data;
            }
            console.error('Could not fetch current user');
        });
}

export function logout()
{
    return axios.post('/api/logout')
        .then(response => {
            if (response.data.success) {
                setToken();
                return response.data;
            }
            console.error('Logout failed');
        });
}

export function register({ email, name, password, password_confirmation })
{
    return axios.post('/api/register', {email, name, password, password_confirmation})
        .then(response => {
            if (response.data.success) {
                let token = response.data.token;
                if (!token) {
                    console.error('No token provided in register response data: ', response.data);
                } else {
                    setToken(token);
                }
                return response.data;
            }
            console.error('Registration unsuccessful: ', response.data);
        });
}
