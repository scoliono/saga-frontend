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
    import { onMount } from 'svelte';
    import FileUpload from '../components/FileUpload.svelte';
    import AjaxButton from '../components/AjaxButton.svelte';
    const { session } = stores();

    onMount(() => {
        api.setToken($session.token);
        M.AutoInit();
    });

    function onError(err)
    {
        M.toast({ html: err });
    }
</script>

<style>
i.verified {
    margin-left: -75px;
}
</style>

<svelte:head>
    {#if $session.user.full_name}
        <title>{$session.user.full_name}'s Profile</title>
    {:else}
        <title>My Profile</title>
    {/if}
</svelte:head>

<h2>
    {#if $session.user.full_name}
        <span style="font-weight:200">Hello</span>
        <span style="font-weight:500">{$session.user.full_name}</span>
    {:else}
        <span style="font-weight:500">My Profile</span>
    {/if}
</h2>
<div class="divider"></div>
{#if $session.user.avatar}
    <p class="center-align">
        <img
            class="circle"
            src={`http://localhost:8000/storage/${$session.user.avatar}`}
            alt={$session.user.full_name}
            height="200"
        >
        {#if $session.user.verified}
            <i class="material-icons medium blue-text white tooltipped circle verified" data-position="bottom" data-tooltip="Verified">check_circle</i>
        {/if}
    </p>
{/if}
<div class="row">
    <a class="btn waves-effect waves-light" href="/profile/edit">
        <i class="material-icons left">edit</i> Edit Profile
    </a>
</div>
{#if $session.user.eth}
    <div class="divider"></div>
    <div class="section">
        <h4>Pay this User</h4>
        <div class="row">
            {#each $session.user.eth as addr}
                <div class="col s6">
                    <img
                        height="200"
                        alt="Ethereum Address QR Code"
                        src={`//localhost:8000/storage/userdata/eth/${addr}.png`}
                    >
                    <p><strong>ETH</strong>: {addr}</p>
                </div>
            {/each}
        </div>
    </div>
{/if}
{#if process.env.NODE_ENV === 'development'}
    <div class="divider"></div>
    <div class="section">
        <p>Debug:</p>
        <AjaxButton
            method="get"
            name="reloadUserData"
            action="/api/user"
            resolve={response => $session.user = response.user}
            reject={onError}
            classes="btn waves-effect waves-light"
        >
            <i class="material-icons left">refresh</i> Reload User Data
        </AjaxButton>
        <pre>{ $session.user ? JSON.stringify($session.user, null, 2) : 'Not loaded' }</pre>
    </div>
{/if}
