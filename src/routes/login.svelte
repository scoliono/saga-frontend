<script context="module">
    export function preload(page, session)
    {
        if (session.user) {
            this.redirect(302, '/');
        }
    }
</script>

<script>
    import * as api from '../api.js';
    import { goto, stores } from '@sapper/app';
    import { loading } from '../stores.js';
    import InputField, { showErrors } from '../components/InputField.svelte';
    import AjaxButton from '../components/AjaxButton.svelte';
    const { preloading, page, session } = stores();

    let email = '', password = '';
    let errors = {};
    let remember;

    async function onLogin(response)
    {
        try {
            $session.user = response.user;
            await api.setSessionVar('user', response.user);
            $session.token = response.token;
            await api.setToken(response.token);
        } catch (err) {
            bulmaToast({
                message: 'Failed to store session data. Please try again.',
                type: 'is-danger'
            });
            return false;
        }
        bulmaToast('Logged in');
        goto('/');
    }

    function onLoginFailed(err)
    {
        if (err.response && err.response.data) {
            bulmaToast({
                message: err.response.data.message,
                type: 'is-danger'
            });
            errors = err.response.data.errors;
        } else {
            bulmaToast({
                message: err.toString(),
                type: 'is-danger'
            });
        }
        $session.user = null;
        $session.token = null;
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<div class="content">
    <h1>Login</h1>
    <form>
        <InputField
            name="email"
            label="Email"
            type="email"
            required
            bind:value={email}
            bind:error={errors.email}
        />
        <InputField
            name="password"
            label="Password"
            type="password"
            bind:value={password}
            bind:error={errors.password}
        />
        <div class="field">
            <input class="switch" type="checkbox" id="remember" name="remember" bind:checked={remember}>
            <label for="remember">Remember Me</label>
        </div>
        <div class="field">
            <AjaxButton
                method="post"
                action="/api/login"
                resolve={onLogin}
                reject={onLoginFailed}
                submit
                data={{ email, password, remember }}
            >
                Login
            </AjaxButton>
        </div>
    </form>
</div>