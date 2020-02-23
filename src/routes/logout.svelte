<script>
    import * as api from '../api.js';
	import { goto, stores } from '@sapper/app';
	import { onMount } from 'svelte';
    const { preloading, page, session } = stores();

	onMount(async () => {
		try {
			const response = await api.logout();
			if (response.success) {
				delete $session.user;
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
				message: err.toString(),
				type: 'is-danger'
			});
		}
	});
</script>
