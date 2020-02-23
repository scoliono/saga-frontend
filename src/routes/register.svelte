<script>
    import * as api from '../api.js';
    import { goto, stores } from '@sapper/app';
    import { onMount } from 'svelte';
	import { loading } from '../stores.js';
    import InputField from '../components/InputField.svelte';
    import AjaxButton from '../components/AjaxButton.svelte';
    const { preloading, page, session } = stores();

    let email = '', password = '', password_confirmation = '', tos = false;
    let disabled = false;
    export let personal = undefined;
    let showPersonal;

    onMount(async () => {
        showPersonal = personal === undefined;
        if (showPersonal) {
            personal = true;
        }
        await api.getCookie();
    });

    let errors = {};

    async function onRegister(response)
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
        goto('/dashboard');
    }

    function onRegisterFailed(err)
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
    <title>Register</title>
</svelte:head>

<div class="content">
    <h1>Register</h1>
    <form>
        <InputField
            required
            bind:value={email}
            label="Email"
            name="email"
            type="email"
            bind:error={errors.email}
        />
        <InputField
            required
            bind:value={password}
            label="Password"
            name="password"
            type="password"
            bind:error={errors.password}
        />
        <InputField
            required
            bind:value={password_confirmation}
            label="Confirm Password"
            name="confirm-password"
            type="password"
            bind:error={errors.password_confirmation}
        />
        {#if showPersonal}
        <div class="field">
            <label class="label">Account Type</label>
            <label for="personal">Merchant</label>
            <input class="switch" type="checkbox" id="personal" name="personal" bind:checked={personal}>
            <label for="personal">Personal</label>
        </div>
        {/if}
        <div class="field">
            <label>
                <input type="checkbox" name="remember" required bind:checked={tos}>
                <span class="lever"></span>
                I have read and agree to the <a href="/support/terms">Terms of Service</a>
            </label>
        </div>
        <AjaxButton
            method="post"
            action="/api/register"
            resolve={onRegister}
            reject={onRegisterFailed}
            submit
            data={{ email, password, password_confirmation, tos, merchant: !personal }}
        >
            Register
        </AjaxButton>
    </form>
</div>