<script context="module">
    export function preload(page, session)
    {
        if (!session.user) {
            this.redirect(302, '/');
        }
    }
</script>

<script>
    import * as api from '../api.js';
	import { goto, stores } from '@sapper/app';
    const { preloading, page, session } = stores();

	if ($session.user) {
		api.logout()
			.then(response => {
				if (response.success) {
					$session.user = null;
					M.toast({ html: 'Logged out' });
					goto('/');
				}
			})
			.catch(err => {
                let msg = err.response ? err.response.data : err;
				M.toast({ html: msg });
			});
	} else {
		goto('/');
	}
</script>
