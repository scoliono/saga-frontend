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
</style>

<svelte:head>
    {#if $session.user.full_name}
        <title>{$session.user.full_name}'s Profile | SAGA</title>
    {:else}
        <title>My Profile | SAGA</title>
    {/if}
</svelte:head>

<div class="content">
    <h2>Profile</h2>
</div>

<div class="container">
    <div class="columns">
        <div class="column has-text-centered">
            <figure class="image">
                {#if $session.user.avatar}
                    <img
                        class="circle"
                        src={`http://localhost:8000/storage/${$session.user.avatar}`}
                        alt={$session.user.full_name}
                        height="200"
                    >
                {/if}
            </figure>
            <p class="title">{$session.user.name}</p>
        </div>
        <div class="column">
            
        </div>
    </div>
    
</div>

<div class="row">
    <a class="btn waves-effect waves-light" href="/profile/edit">
        <i class="material-icons left">edit</i> Edit Profile
    </a>
</div>
{#if $session.user.eth && $session.user.eth.length}
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
