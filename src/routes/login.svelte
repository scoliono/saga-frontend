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

    let email = '', password = '';
    function login(event)
    {
        $loading = true;
        api.login({ email, password })
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
    <title>Login</title>
</svelte:head>

<h1>Login</h1>
<div class="login-form">
    <form on:submit|preventDefault={login}>
        <p><label>Email:</label> <input required bind:value={email} name="email" type="email"></p>
        <p><label>Password:</label> <input required bind:value={password} name="password" type="password"></p>
        <button disabled={$loading} class="btn waves-effect waves-light" type="submit">Login</button>
    </form>
</div>