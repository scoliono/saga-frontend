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

    let email = '', password = '', password_confirmation = '';
    let disabled = false;

    function register()
    {
        api.register({ email, password, password_confirmation })
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
            <div class="input-field col s12">
                <input required bind:value={password_confirmation} id="confirm-password" name="confirm-password" type="password">
                <label for="confirm-password">Confirm Password</label>
            </div>
        </div>
        <div class="row">
            <div class="col s12">
                <button type="submit" class="btn waves-effect waves-light" disabled={$loading}>Register</button>
            </div>
        </div>
    </form>
</div>