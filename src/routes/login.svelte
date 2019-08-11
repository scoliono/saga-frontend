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
    let rememberEl;
    async function login(event)
    {
        $loading = true;
        try {
            let data = { email, password };
            if (rememberEl.checked) {
                data.remember = true;
            }
            const response = await api.login(data);
            $session.user = response.user;
            $session.token = response.token;
            M.toast({ html: 'Logged in' });
            goto('/dashboard');
        } catch (err) {
            let msg = err.response ? err.response.data : err;
            M.toast({ html: msg });
            $session.user = null;
            $session.token = null;
        } finally {
            $loading = false;
        }
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<h1>Login</h1>
<div class="login-form">
    <form on:submit|preventDefault={login}>
        <div class="row">
            <div class="input-field col s12">
                <input required bind:value={email} id="email" name="email" type="email">
                <label for="email">Email</label>
            </div>
        </div>
        <div class="row">
            <div class="input-field col s12">
                <input required bind:value={password} id="password" name="password" type="password">
                <label for="password">Password</label>
            </div>
        </div>
        <div class="row">
            <div class="col s12">
                <div class="switch">
                    <label>
                        Remember Me
                        <input type="checkbox" name="remember" bind:this={rememberEl}>
                        <span class="lever"></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col s12">
                <button disabled={$loading} class="btn waves-effect waves-light" type="submit">Login</button>
            </div>
        </div>
    </form>
</div>