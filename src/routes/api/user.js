import axios from 'axios';

export function get(req, res)
{
    if (!req.headers['authorization']) {
        res.statusCode = 401;
        res.end(JSON.stringify({
            success: false,
            errors: ['Unauthorized']
        }));
    } else {
        axios.get('/user', {
            headers: { Authorization: req.headers['authorization'] }
        }).then(response => {
            if (response.data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(response.data));
            } else {
                console.error('Could not fetch user data');
            }
        }).catch(err => {
            console.error(err);
            res.statusCode = err.response ? err.response.status : 500;
            res.end(err.message);
        });
    }
}
