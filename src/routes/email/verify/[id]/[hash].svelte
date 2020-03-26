<script>
    import * as api from '../../../../api.js';
    import { onMount } from 'svelte';
    import { goto, stores } from '@sapper/app';
    const { session, page, preloading } = stores();

    let { expires, signature } = $page.query;
    let { id, hash } = $page.params;

    onMount(async () => {
        try {
            let request = await api.get(`/api/email/verify/${id}/${hash}?signature=${signature}&expires=${expires}`);
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

