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
	import { onMount } from 'svelte';
    const { preloading, page, session } = stores();

	onMount(async () => {
		if ($session.user) {
			try {
				const response = await api.logout();
				if (response.success) {
					$session.user = null;
					M.toast({ html: 'Logged out' });
					goto('/');
				}
			} catch (err) {
				let msg = err.response ? err.response.data : err;
				M.toast({ html: msg });
			}
		} else {
			goto('/');
		}
	});
</script>
