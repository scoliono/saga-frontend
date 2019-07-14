<script context="module">
    export function preload(page, session)
    {
        if (!session.user) {
            this.redirect(302, '/login');
        }
    }
</script>

<script>
    import * as api from '../api.js';
    import { goto, stores } from '@sapper/app';
    const { session } = stores();

    let user;
    async function loadUser() {
        user = undefined;
        api.setToken($session.token);
        user = await api.user();
    }
</script>

<svelte:head>
    <title>{ $session.user.name }'s Profile</title>
</svelte:head>

<h1>Profile</h1>
<p>Hello <span style="font-weight:500;">{$session.user.name}</span></p>
{#if process.env.NODE_ENV === 'development'}
    <p>Debug:</p>
    <button on:click={loadUser}>Load User Data</button>
    <pre>{ user ? JSON.stringify(user, null, 2) : 'Not loaded' }</pre>
{/if}
