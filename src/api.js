import axios from 'axios';
import querystring from 'querystring';

let request = axios.create({
    timeout: 5000,
    withCredentials: true
});

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

export async function post(url, data, urlencode = true)
{
    if (url[0] === '/') {
        url = url.slice(1);
    }
    let options = { headers: {} };
    if (urlencode) {
        data = querystring.stringify(data);
        options.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
    const response = await request.post(url, data, options);
    if (response.data.success) {
        return response.data;
    } else {
        throw new Error(`POST request to "${url}" failed: ${JSON.stringify(response.data.errors)}`);
    }
}

export async function getCookie()
{
    await request.get('airlock/csrf-cookie');
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
        return response.data;
    } else {
        throw new Error('Logout failed: ' + JSON.stringify(response.data.errors));
    }
}
