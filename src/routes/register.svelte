<script context="module">
    export function preload(page, session)
    {
        if (session.user) {
            this.redirect(302, '/dashboard');
        }
    }
</script>

<script>
    import * as api from '../api.js';
    import { goto, stores } from '@sapper/app';
	import { loading } from '../stores.js';
    const { preloading, page, session } = stores();

    let email = '', name = '', password = '', password_confirmation = '';
    let disabled = false;

    function register()
    {
        api.register({ email, name, password, password_confirmation })
            .then(response => {
                $loading = false;
                $session.user = response.user;
                $session.token = response.token;
                M.toast({ html: 'Logged in' });
                goto('/dashboard');
            })
            .catch(err => {
                let msg = err.response ? err.response.data : err;
                $loading = false;
                M.toast({ html: msg });
                $session.user = null;
                $session.token = null;
            });
    }
</script>

<svelte:head>
    <title>Register</title>
</svelte:head>

<h1>Register</h1>
<div class="register-form">
    <form on:submit|preventDefault={register}>
        <p><label>Name:</label> <input name="name" bind:value={name} type="text"></p>
        <p><label>Email:</label> <input name="email" bind:value={email} type="text"></p>
        <p><label>Password:</label> <input name="password" bind:value={password} type="password"></p>
        <p><label>Confirm Password:</label> <input name="confirm-password" bind:value={password_confirmation} type="password"></p>
        <button type="submit" class="btn waves-effect waves-light" disabled={$loading}>Register</button>
    </form>
</div>