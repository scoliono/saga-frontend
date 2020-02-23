<script>
    import * as api from '../api.js';
    import { goto, stores } from '@sapper/app';
    import { loading } from '../stores.js';
    import { onMount } from 'svelte';
    import InputField from '../components/InputField.svelte';
    import AjaxButton from '../components/AjaxButton.svelte';
    const { preloading, page, session } = stores();

    let email = '', password = '';
    export let personal = undefined;
    let errors = {};
    let remember;
    let showPersonal;

    onMount(async () => {
        showPersonal = personal === undefined;
        if (showPersonal) {
            personal = true;
        }
        await api.getCookie();
    });

    async function onLogin(response)
    {
        try {
            $session.user = response.user;
        } catch (err) {
            bulmaToast({
                message: 'Failed to store session data. Please try again.',
                type: 'is-danger'
            });
            return false;
        }
        bulmaToast('Logged in');
        goto($page.query.redirect ? decodeURIComponent($page.query.redirect) : '/dashboard');
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
        <!-- merchant/customer field would go here -->
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
                data={{ email, password, remember, merchant: !personal }}
            >
                Login
            </AjaxButton>
        </div>
    </form>
</div>