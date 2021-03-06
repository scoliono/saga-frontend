import * as sapper from '@sapper/app';
require('./_sass/global.scss');

import { toast } from 'bulma-toast';
window.bulmaToast = args => {
	const defaults = {
		animate: { in: 'fadeIn', out: 'fadeOut' },
		position: 'bottom-right',
		type: 'is-info'
	};
	if (typeof args === 'string') {
		toast(Object.assign({ message: args }, defaults));
	} else {
		toast(Object.assign(defaults, args));
	}
};

import Echo from 'laravel-echo';
window.io = require('socket.io-client');
window.Echo = new Echo({
	broadcaster: 'socket.io',
	host: window.location.hostname === 'localhost' ? 'localhost:6001'
		: 'io.' + window.location.hostname.replace(/^www\./, '')
});

sapper.start({
	target: document.querySelector('#sapper')
});

