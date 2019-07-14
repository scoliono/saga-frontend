import axios from 'axios';

export function post(req, res)
{
    axios.post('/login', req.body).then(response => {
        if (response.data.success) {
            if (response.data.user) {
                req.session.user = response.data.user;
            }
            if (response.data.token) {
                req.session.token = response.data.token;
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response.data));
        }
    }).catch(err => {
        console.error(err);
        res.statusCode = err.response ? err.response.status : 500;
        res.end(err.response ? err.response.data.errors[0] : err.message);
    });
}
