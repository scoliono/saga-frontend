import sirv from 'sirv';
import polka from 'polka';
import redis from 'redis';
import bodyParser from 'body-parser';
import compression from 'compression';
import session from 'express-session';
import * as sapper from '@sapper/server';
import routes from './routes.js';

import * as api from './api.js';
import Cookie from 'cookie-universal';

const { createProxyMiddleware } = require('http-proxy-middleware');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();
require('dotenv').config();

const { PORT, NODE_ENV, SESSION_SECRET, API_URL } = process.env;
const dev = NODE_ENV === 'development';

const apiProxy = createProxyMiddleware(
	['/api', '/airlock/csrf-cookie', '/userdata'],
	{
		target: API_URL || 'http://127.0.0.1:8000',
		ws: true,
		changeOrigin: true,
		onError: (err, req, res) => {
			res.writeHead(500, {'content-type': 'application/json'});
			res.end(JSON.stringify({
				success: false,
				message: 'Proxy error'
			}));
		}
	}
);

polka() // You can also use Express
	.use(bodyParser.json())
	.use(session({
		resave: false,
		saveUninitialized: false,
		secret: SESSION_SECRET,
		cookie: {
			maxAge: 31536000
		},
		store: new RedisStore({ client: redisClient })
	}))
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		apiProxy,
		// authMiddleware,
		sapper.middleware({
			session: (req, res) => ({
				expanded: req.session && req.session.expanded,
				user: req.session && req.session.user,
				ce_confirmed: req.session && req.session.ce_confirmed
			})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
