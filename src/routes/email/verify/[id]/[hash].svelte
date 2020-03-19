<script>
    import * as api from '../../../api.js';
    import { onMount } from 'svelte';
    import { goto } from '@sapper/app';

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const expires = urlParams.get('expires');
        const signature = urlParams.get('signature');
        const [ id, hash ] = window.location.pathname.substr('/email/verify/'.length).split('/');

        try {
            let request = await api.get(`/api/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`);
            bulmaToast('Successfully verified email');
            goto('/profile');
        } catch (err) {
            bulmaToast({
                message: 'Failed to verify email: '+ err.message,
                type: 'is-danger'
            });
        }
    });
</script>

<svelte:head>
    <title>Verify Email | SAGA</title>
</svelte:head>

<div class="content">
    <h1>Verifying Email&hellip;</h1>
</div>

