<script>
    import * as api from '../api.js';
    import { goto, stores } from '@sapper/app';
    import { onMount } from 'svelte';
    import FileUpload from '../components/FileUpload.svelte';
    import AjaxButton from '../components/AjaxButton.svelte';
    import InputField from '../components/InputField.svelte';
    import CardModal from '../components/CardModal.svelte';
    const { session, page } = stores();

    let editing = false, editingPhone = false, editingLocation = false;
    let user;
    let avatarModal, fileUpload, uploading;
    let ethModal, newEth = '', ethErrors = {};

    onMount(async () => {
        $session.user = await api.user();
    });

    function addEth()
    {
        if (newEth === '') {
            bulmaToast({
                message: 'You must enter an Ethereum address.',
                type: 'is-danger'
            });
            return;
        }
        ethErrors = {};
        $session.user.eth = $session.user.eth === null ? [newEth] : [...$session.user.eth, newEth];
        newEth = '';
    }

    function removeEth(i)
    {
        ethErrors = {};
        $session.user.eth.splice(i, 1);
        // just svelte things
        $session.user.eth = $session.user.eth;
    }

    async function onUpdatedUserInfo()
    {
        bulmaToast('Successfully updated profile info');
        $session.user = await api.user();
        editing = false;
    }

    async function onResetUserInfo()
    {
        $session.user = await api.user();
        editing = false;
    }
</script>

<style>
    figure.image {
        margin: 0 auto;
    }
    p.has-text-weight-bold {
        margin-bottom: 3px;
    }
</style>

<svelte:head>
    {#if $session.user.full_name}
        <title>{$session.user.full_name}'s Profile | SAGA</title>
    {:else}
        <title>My Profile | SAGA</title>
    {/if}
</svelte:head>

<div class="container">
    <h1 class="title">Profile</h1>
	<div class="columns panel has-background-white" style="width:70%;">
    {#if $session.user}
        <div class="column is-6 has-text-centered">
            <figure class="image is-128x128">
                <img class="is-rounded" src={'/' + ($session.user.avatar || 'saga-icon.svg')} alt="Avatar">
            </figure>
            <h2 class="subtitle" style="margin:10px;">
                {#if !editing}
                    {$session.user.full_name || 'My Profile'}
                    {#if $session.user.verified}
                        <span class="icon has-text-success" title="Verified">
                            <i class="fas fa-check-circle"></i>
                        </span>
                    {:else}
                        <span class="icon has-text-danger" title="Unverified">
                            <i class="fas fa-exclamation-circle"></i>
                        </span>
                    {/if}
                {:else}
                <div class="columns">
                    <div class="column">
                        <InputField
                            name="first_name"
                            label="First Name"
                            bind:value={$session.user.first_name}
                            placeholder="First Name"
                        />
                    </div>
                    <div class="column">
                        <InputField
                            name="middle_name"
                            label="Middle Name"
                            bind:value={$session.user.middle_name}
                            placeholder="Middle Name"
                        />
                    </div>
                    <div class="column">
                        <InputField
                            name="last_name"
                            label="Last Name"
                            bind:value={$session.user.last_name}
                            placeholder="Last Name"
                        />
                    </div>
                </div>
                {/if}
            </h2>
            <div class="columns is-multiline">
                {#if !editing}
                    {#if !$session.user.verified}
                    <div class="column is-one-half">
                        <button class="button is-rounded" on:click={() => { editing = true }}>
                            <span class="icon">
                                <i class="fas fa-edit"></i>
                            </span>
                            <span>Edit</span>
                        </button>
                    </div>
                    {/if}
                    <div class="column is-one-half">
                        <AjaxButton
                            method="post"
                            action="/api/password/email"
                            classes="is-rounded"
                            data={{ email: $session.user.email }}
                            resolve={response => {
                                bulmaToast(response.message)
                            }}
                            reject={err => {
                                bulmaToast({
                                    message: err.message
                                        || 'Unknown error sending password reset email',
                                    type: 'is-danger'
                                });
                            }}
                        >
                            <span class="icon">
                                <i class="fas fa-key"></i>
                            </span>
                            <span>Change Password</span>
                        </AjaxButton>
                    </div>
                    <div class="column is-one-half">
                        <button class="button is-rounded" on:click={avatarModal.open}>
                            <span class="icon">
                                <i class="fas fa-image"></i>
                            </span>
                            <span>Change Avatar</span>
                        </button>
                    </div>
                    <div class="column is-one-half">
                        <button class="button is-rounded" on:click={ethModal.open}>
                            <span class="icon">
                                <i class="fab fa-ethereum"></i>
                            </span>
                            <span>Edit Ethereum Addresses</span>
                        </button>
                    </div>
                {:else}
                    <AjaxButton
                        method="post"
                        action="/api/profile/personal"
                        classes="is-rounded is-info"
                        data={{
                            first_name: $session.user.first_name,
                            middle_name: $session.user.middle_name,
                            last_name: $session.user.last_name,
                            gender: $session.user.gender,
                            birthday: $session.user.birthday
                        }}
                        resolve={onUpdatedUserInfo}
                        reject={err => {
                            bulmaToast({
                                message: err.message
                                    || 'Unknown error updating profile',
                                type: 'is-danger'
                            });
                            editing = false;
                        }}
                    >
                        Save
                    </AjaxButton>
                    <button class="button" on:click={onResetUserInfo}>Cancel</button>
                {/if}
            </div>
        </div>
        <div class="column is-6">
            <div class="content">
                <p class="has-text-weight-bold">Account Email</p>
                {#if $session.user.email_verified_at}
                    <p>
                        {$session.user.email}
                        <span class="icon has-text-success" title="Verified">
                            <i class="fas fa-check-circle"></i>
                        </span>
                    </p>
                {:else}
                    <p>
                        {$session.user.email}
                        <span class="icon has-text-danger" title="Unverified">
                            <i class="fas fa-exclamation-circle"></i>
                        </span>
                    </p>
                    <p>
                        <AjaxButton
                            method="post"
                            action="/api/email/resend"
                            classes="is-rounded is-small"
                            data={{ email: $session.user.email }}
                            resolve={() => {
                                bulmaToast('A new verification email is on its way. Check your inbox in a few seconds. ' +
                                        'If you don\'t see anything after a while, check your spam folder too.');
                            }}
                            reject={err => {
                                bulmaToast({
                                    message: err.message
                                        || 'Unknown error sending verification reset email',
                                    type: 'is-danger'
                                });
                            }}
                        >
                            Resend Verification Email
                        </AjaxButton>
                    </p>
                {/if}
                <hr>
                <p class="has-text-weight-bold">Account Type</p>
                <p>{$session.user.merchant ? 'Merchant' : 'Personal'}</p>
                <hr>
                <p class="has-text-weight-bold">Phone</p>
                {#if !editingPhone}
                    <p>
                        {#if $session.user.phone}
                            <a href={`tel:${$session.user.phone}`}>{$session.user.phone}</a>
                        {:else}
                            (none)
                        {/if}
                        <button class="button is-pulled-right is-rounded is-small" on:click={() => { editingPhone = true; }}>
                            <span class="icon">
                                <i class="fas fa-edit"></i>
                            </span>
                            <span>Edit</span>
                        </button>
                    </p>
                {:else}
                    <div class="field">
                        <div class="control">
                            <InputField
                                name="phone"
                                label=""
                                bind:value={$session.user.phone}
                            />
                        </div>
                    </div>
                {/if}
                {#if editingPhone}
                <div class="level">
                    <AjaxButton
                        method="post"
                        action="/api/profile/contact"
                        classes="is-rounded is-small"
                        data={{ phone: $session.user.phone, location: $session.user.location }}
                        resolve={() => {
                            bulmaToast('Successfully updated phone number');
                            editingPhone = false;
                        }}
                        reject={err => {
                            bulmaToast({
                                message: err.message
                                    || 'Unknown error setting phone number',
                                type: 'is-danger'
                            });
                            editingPhone = false;
                        }}
                    >
                        Save
                    </AjaxButton>
                    <button class="button is-rounded is-small" on:click={async () => {
                        $session.user = await api.user();
                        editingPhone = false;
                    }}>Cancel</button>
                </div>
                {/if}
                <p class="has-text-weight-bold">Location</p>
                {#if !editingLocation}
                    <p>
                        {#if $session.user.location}
                            <a href={`maps:q=${$session.user.location}`}>{$session.user.location}</a>
                        {:else}
                            <span class="has-text-italics">(none)</span>
                        {/if}
                        <button class="button is-pulled-right is-rounded is-small" on:click={() => { editingLocation = true; }}>
                            <span class="icon">
                                <i class="fas fa-edit"></i>
                            </span>
                            <span>Edit</span>
                        </button>
                    </p>
                {:else}
                    <div class="field">
                        <div class="control">
                            <InputField
                                name="location"
                                label=""
                                bind:value={$session.user.location}
                            />
                        </div>
                    </div>
                {/if}
                {#if editingLocation}
                <div class="level">
                    <AjaxButton
                        method="post"
                        action="/api/profile/contact"
                        classes="is-rounded is-small"
                        data={{ phone: $session.user.phone, location: $session.user.location }}
                        resolve={() => {
                            bulmaToast('Successfully updated location');
                            editingLocation = false;
                        }}
                        reject={err => {
                            bulmaToast({
                                message: err.message
                                    || 'Unknown error setting location',
                                type: 'is-danger'
                            });
                            editingLocation = false;
                        }}
                    >
                        Save
                    </AjaxButton>
                    <button class="button is-rounded is-small" on:click={async () => {
                        $session.user = await api.user();
                        editingLocation = false;
                    }}>Cancel</button>
                </div>
                {/if}
                <small>Your phone and location will be publicly available.</small>
            </div>
        </div>
    {:else}
        Loading profile data&hellip;
    {/if}
    </div>
</div>

<!-- Begin modals -->
<CardModal bind:this={avatarModal} title="Change Avatar">
    <section class="modal-card-body">
        <FileUpload
            bind:this={fileUpload}
            bind:isUploading={uploading}
            action="/api/profile/avatar"
            name="avatar"
            button={false}
            accept="image/*"
            resolve={async () => {
                bulmaToast('Successfully changed avatar');
                avatarModal.close();
                $session.user = await api.user();
            }}
            reject={err => {
                bulmaToast({
                    message: err.message
                        || 'Unknown error changing avatar',
                    type: 'is-danger'
                });
            }}
        />
    </section>
    <footer class="modal-card-foot">
        <button
            type="submit"
            class="button is-info"
            on:click={() => {
                fileUpload.submit();
            }}
            class:is-loading={uploading}
        >
            Upload
        </button>
    </footer>
</CardModal>
<CardModal bind:this={ethModal} title="Edit Ethereum Addresses">
    <section class="modal-card-body">
        <div class="content">
            <h3>Your Ethereum Addresses</h3>
            {#if $session.user}
                {#if $session.user.eth && $session.user.eth.length}
                <ul>
                    {#each $session.user.eth as eth, i}
                        <li>
                            <span>{eth}</span>
                            <button on:click|preventDefault={() => { removeEth(i); }} class="button is-small">
                                <span class="icon">
                                    <i class="fas fa-trash"></i>
                                </span>
                            </button>
                            {#if ethErrors[`eth.${i}`]}
                                <p class="has-text-danger is-size-7">{ethErrors[`eth.${i}`][0]}</p>
                            {/if}
                        </li>
                    {/each}
                </ul>
                {:else}
                    <p>You currently have no Ethereum addresses.</p>
                {/if}
            {/if}
            <div class="columns">
                <div class="column">
                    <input type="text" class="input" maxlength="66" placeholder="0xABCDEF..." bind:value={newEth}>
                </div>
                <div class="column is-narrow">
                    <button class="button" on:click|preventDefault={addEth}>
                        <span class="icon">
                            <i class="fas fa-plus"></i>
                        </span>
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    </section>
    <footer class="modal-card-foot">
        <AjaxButton
            action="/api/profile/wallets"
            method="post"
            classes="is-info"
            data={{
                'eth[]': $session.user.eth
            }}
            resolve={res => {
                bulmaToast('Successfully updated Ethereum addresses');
                ethModal.close(true);
                $session.user.eth = res.eth;
            }}
            reject={err => {
                ethErrors = err.response.data.errors;
                bulmaToast({
                    message: 'Failed to update Ethereum addresses',
                    type: 'is-danger'
                });
            }}
        >
            Save
        </AjaxButton>
        <button class="button" on:click|preventDefault={async () => {
            ethModal.close();
            $session.user = await api.user();
        }}>
            Cancel
        </button>
    </footer>
</CardModal>
<!-- End modals -->
