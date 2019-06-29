<script>
    import * as api from '../api.js';
	import { goto, stores } from '@sapper/app';
	import { loading } from '../stores.js';
    const { preloading, page, session } = stores();

	if ($session.user) {
		api.logout()
			.then(response => {
				if (response.data.success) {
					$session.user = null;
					M.toast({ html: 'Logged out' });
					goto('/');
				}
			})
			.catch(err => {
				let msg = err.response.data.error || err;
				M.toast({ html: msg });
			});
	} else {
		goto('/');
	}
</script>
