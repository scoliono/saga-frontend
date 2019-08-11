import axios from 'axios';

export function post(req, res)
{
    axios.post('/logout', req.body).then(response => {
        if (response.data.success) {
            req.session.user = null;
            req.session.token = null;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response.data));
        }
    }).catch(err => {
        console.error(err);
        res.statusCode = err.response ? err.response.status : 500;
        res.end(err.message);
    });
}
