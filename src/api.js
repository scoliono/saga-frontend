import axios from 'axios';

let request = axios.create({
    baseURL: 'http://localhost:8000/'
});

export function setToken(token)
{
    setSessionVar('token', token);
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
    const response = await request.get(url, { params: data });
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
    const response = await request.post(url, data);
    if (response.data.success) {
        return response.data;
    } else {
        throw new Error(`POST request to "${url}" failed: ${JSON.stringify(response.data.errors)}`);
    }
}

export async function user()
{
    const response = await request.get('api/user');
    if (response.data.success) {
        return response.data.user;
    } else {
        throw new Error('Fetching current user returned no data: ' + JSON.stringify(response.data));
    }
}

export async function setSessionVar(name, value)
{
    value = value === null || value === undefined ? null : JSON.stringify(value);
    const response = await axios.post('/api/session', { name, value });
    if (response.data.success) {
        return true;
    } else {
        throw new Error(`Could not update session var "${name}": ${JSON.stringify(response.data)}`);
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
    const response = await request.post(action, data, options);
    if (response.data.success) {
        return response.data;
    } else {
        throw new Error('Uploading form data failed: ' + JSON.stringify(response.data.errors));
    }
}

export async function logout()
{
    const response = await request.post('api/logout');
    if (response.data.success) {
        setToken();
        return response.data;
    } else {
        throw new Error('Logout failed: ' + JSON.stringify(response.data.errors));
    }
}
