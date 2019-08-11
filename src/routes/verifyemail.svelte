<script>
    import { goto, stores } from '@sapper/app';
    import { onMount } from 'svelte';
    import * as api from '../api.js';
    const { session } = stores();

    let query = new URLSearchParams(window.location.search);
    onMount(async () => {
        let id = query.get('id');
        let expires = query.get('expires');
        let signature = query.get('signature');
        if (!id || !expires || !signature) {
            M.toast({ html: 'You are missing the required information to validate your email address. ' +
                'Please make sure you copied the URL from the validation email correctly.' });
            goto('/');
        } else {
            api.setToken($session.token);
            try {
                let res = await api.get('/api/email/verify/' + id, { expires, signature });
                if (res.success) {
                    M.toast({ html: 'Successfully validated email address' });
                    goto('/dashboard');
                }
            } catch (err) {
                M.toast({ html: err });
                goto('/');
            }
        }
    });
</script>

<svelte:head>
    <title>Verify Email</title>
</svelte:head>


