import axios from 'axios';

let request = axios.create();

export function setToken(token)
{
    if (token) {
        request.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete request.defaults.headers.common['Authorization'];
    }
}

export async function get(url, data)
{
    // duplicate slashes can break URL signatures so this is a workaround lel
    if (url[0] === '/') {
        url = url.slice(1);
    }
    const response = await request.get(`http://localhost:8000/${url}`, { params: data });
    if (response.data.success) {
        return response.data;
    } else {
        throw new Error(`GET request to "${url}" failed: ${JSON.stringify(response.data.errors)}`);
    }
}

export async function post(url, data)
{
    if (url[0] === '/') {
        url = url.slice(1);
    }
    const response = await request.post(`http://localhost:8000/${url}`, data);
    if (response.data.success) {
        return response.data;
    } else {
        throw new Error(`POST request to "${url}" failed: ${JSON.stringify(response.data.errors)}`);
    }
}

export async function login(credentials)
{
    const response = await request.post('/api/login', credentials);
    if (response.data.success) {
        let token = response.data.token;
        if (!token) {
            throw new Error('No token provided in login response data: ', response.data);
        } else {
            setToken(token);
        }
        return response.data;
    } else {
        /* this shouldn't be too necessary because if the http response
           uses the proper error code, the method should throw an exception anyway. */
        throw new Error('Could not log in: ' + JSON.stringify(response.data.errors));
    }
}

export async function user()
{
    const response = await request.get('/api/user');
    if (response.data.success) {
        return response.data.user;
    } else {
        throw new Error('Fetching current user returned no data: ' + JSON.stringify(response.data));
    }
}

export async function upload(action, data, callback)
{
    if (!(data instanceof FormData)) {
        throw new Error('Data was not of type FormData');
    }
    let options = {
        headers: { 'Content-Type': 'multipart/form-data' }
    };
    if (typeof callback === 'function') {
        options.onUploadProgress = callback;
    }
    const response = await request.post(`http://localhost:8000/${action}`, data, options);
    if (response.data.success) {
        return response.data;
    } else {
        throw new Error('Updating profile failed: ' + JSON.stringify(response.data.errors));
    }
}

export async function logout()
{
    const response = await request.post('/api/logout');
    if (response.data.success) {
        setToken();
        return response.data;
    } else {
        throw new Error('Logout failed: ' + JSON.stringify(response.data.errors));
    }
}

export async function register({ email, name, password, password_confirmation })
{
    const response = await request.post('/api/register', { email, name, password, password_confirmation });
    if (response.data.success) {
        let token = response.data.token;
        if (!token) {
            throw new Error('Token expected in register response data, but none provided: ' +
                JSON.stringify(response.data));
        } else {
            setToken(token);
        }
        return response.data;
    } else {
        throw new Error('Registration unsuccessful: ' + JSON.stringify(response.data.errors));
    }
}
