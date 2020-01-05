export function post(req, res)
{
    try {
        // putting a blank 'value' should clear the field
        req.session[req.body.name] = req.body.value === null ? undefined : JSON.parse(req.body.value);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({
            success: true
        }));
    } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end(JSON.stringify({
            success: false,
            errors: [ err ]
        }));
    }
}
