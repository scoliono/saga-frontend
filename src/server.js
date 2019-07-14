import axios from 'axios';
import sirv from 'sirv';
import polka from 'polka';
import bodyParser from 'body-parser';
import compression from 'compression';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import * as sapper from '@sapper/server';

axios.defaults.baseURL = 'http://[::1]:8000/api/';

const FileStore = sessionFileStore(session);
require('dotenv').config();

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(bodyParser.json())
	.use(session({
		resave: false,
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET,
		cookie: {
			maxAge: 31536000
		},
		store: new FileStore()
	}))
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware({
			session: (req, res) => ({
				user: req.session && req.session.user,
				token: req.session && req.session.token
			})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
