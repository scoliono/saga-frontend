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
					await api.setSessionVar('user', null);
					$session.token = null;
					await api.setToken(null);
					bulmaToast('Logged out');
					goto('/');
				} else {
					bulmaToast({
						message: response.errors[0],
						type: 'is-danger'
					});
				}
			} catch (err) {
				bulmaToast({
					message: err,
					type: 'is-danger'
				});
			}
		} else {
			goto('/');
		}
	});
</script>
