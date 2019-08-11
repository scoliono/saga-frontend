<script context="module">
    export function preload(page, session)
    {
        if (!session.user) {
            this.redirect(302, '/login');
        }
    }
</script>

<script>
    import * as api from '../../api.js';
    import { stores } from '@sapper/app';
    import { onMount } from 'svelte';
    import FileUpload from '../../components/FileUpload.svelte';
    import AjaxButton from '../../components/AjaxButton.svelte';
    const { session } = stores();

    let first_name = $session.user.first_name || '';
    let middle_name = $session.user.middle_name || '';
    let last_name = $session.user.last_name || '';
    let gender = $session.user.gender || '';
    let birthdayEl;
    let birthday = $session.user.birthday;

    let btc = $session.user.btc || '';
    let eth = $session.user.eth || '';

    onMount(async () => {
        api.setToken($session.token);
        M.AutoInit();
        let elems = document.querySelectorAll('.datepicker');
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let instances = M.Datepicker.init(elems, {
            format: 'yyyy-mm-dd',
            defaultDate: birthday ? new Date(birthday.replace(/-/g, '/')) : undefined,
            setDefaultDate: true,
            maxDate: yesterday,
            yearRange: [1900, yesterday.getFullYear()],
            onClose: () => {
                const pad = num => (num + '').padStart(2, '0');
                birthday = birthdayEl.value;
            },
            showClearBtn: true,
        });
    });

    async function onSuccessfulUpdate(label) {
        $session.user = await api.user();
        M.toast({ html: label + ' updated successfully' });
    }

    function onUpdateAvatar(response) {
        M.toast({ html: 'Successfully updated avatar' });   
        $session.user.avatar = response.avatar;
    }

    function onUploadFailed(err) {
        M.toast({ html: err });
    }

    function onClearAvatar() {
        M.toast({ html: 'Cleared avatar successfully' });
        $session.user.avatar = null;
    }

    function onUploadID() {
        M.toast({ html: 'Uploaded identification successfully' });
    }

    function onEmailResent() {
        M.toast({ html: 'A new verification email is on its way. Check your inbox in a few seconds. ' +
            'If you don\'t see anything after a while, check your spam folder too.' });
    }
</script>

<h2>Edit Profile</h2>
<div class="divider"></div>
<div class="section">
    <div class="row">
        <div class="col s4">
            {#if $session.user.avatar}
                <img
                    class="circle"
                    src={`http://localhost:8000/storage/${$session.user.avatar}`}
                    alt={$session.user.full_name}
                    height="200"
                >
            {:else}
                <p>You don't have an avatar set.</p>
            {/if}
        </div>
        <div class="col s8">
            <div class="row">
                <FileUpload
                    name="avatar"
                    action="/api/profile/update/avatar"
                    accept="image/*"
                    resolve={onUpdateAvatar}
                    reject={onUploadFailed}
                />
            </div>
            <div class="row">
                <AjaxButton
                    method="post"
                    name="clearAvatar"
                    action="/api/profile/clear/avatar"
                    resolve={onClearAvatar}
                    reject={onUploadFailed}
                    classes="btn waves-effect waves-light"
                >
                    <i class="material-icons left">delete</i> Clear Avatar
                </AjaxButton>
            </div>
        </div>
    </div>
</div>
<div class="divider"></div>
<div class="section">
    <h4>Email Settings</h4>
    <div class="row">
        <div class="input-field col s4">
            <input type="text" disabled value={$session.user.email} id="email">
            <label class="active" for="email">Email Address</label>
        </div> 
    </div>
    <div class="row">
        <div class="col s4">
            <p>Your email address is currently <strong>{$session.user.email_verified_at ? 'verified' : 'not verified'}</strong>.</p>
        </div>
        <div class="col s4">
            {#if !$session.user.email_verified_at}
                <AjaxButton
                    name="resendEmail"
                    action="/api/email/resend"
                    method="post"
                    resolve={onEmailResent}
                    reject={onUploadFailed}
                    classes="btn waves-effect waves-light"
                >
                    Resend Verification Email
                </AjaxButton>
            {/if}
        </div>
    </div>
</div>
<div class="divider"></div>
<div class="section">
    <h4>Personal Information</h4>
    <p>We need the following information from you before you can exchange SAGA for real-world currency or send invoices to comply with Know Your Customer (KYC) laws. Please enter your legal name, and refrain from using any aliases.</p>
    <p>You can clear your name at any time before your account is verified, and doing so will cancel the verification process.</p>
    <div class="row">
        <div class="input-field col s4">
            <input disabled={$session.user.verified} id="first_name" name="first_name" bind:value={first_name} type="text">
            <label class={first_name ? 'active' : ''} for="first_name">First Name</label>
        </div>
        <div class="input-field col s4">
            <input disabled={$session.user.verified} id="middle_name" name="middle_name" bind:value={middle_name} type="text">
            <label class={middle_name ? 'active' : ''} for="middle_name">Middle Name (if applicable)</label>
        </div>
        <div class="input-field col s4">
            <input disabled={$session.user.verified} id="last_name" name="last_name" bind:value={last_name} type="text">
            <label class={last_name ? 'active' : ''} for="last_name">Last Name</label>
        </div>
    </div>
    <div class="row">
        <div class="input-field col s6">
            <select disabled={$session.user.verified} id="gender" bind:value={gender}>
                <option value="" selected>Choose a gender</option>
                <option value="m">Male</option>
                <option value="f">Female</option>
                <option value="o">Other</option>
            </select>
            <label for="gender">Gender</label>
        </div>
        <div class="input-field col s6">
            <input disabled={$session.user.verified} id="birthday" type="text" class="datepicker" bind:this={birthdayEl}>
            <label class={birthday ? 'active' : ''} for="birthday">Date of Birth</label>
        </div>
    </div>
    {#if !$session.user.verified}
        <div class="row">
            <AjaxButton
                name="updateProfile"
                action="/api/profile/update/personal"
                method="post"
                data={{
                    first_name,
                    middle_name,
                    last_name,
                    gender,
                    birthday,
                }}
                resolve={() => { onSuccessfulUpdate('Personal info'); }}
                reject={onUploadFailed}
                classes="btn waves-effect waves-light"
            >
                Save
            </AjaxButton>
        </div>
    {:else}
        <div class="row">
            <button class="btn waves-effect waves-light" disabled>Save</button>
            <p>You cannot update your personal info now that your identity has been verified. If you believe there is an error, or if any part of your identity has changed from what is shown above, please contact our support.</p>
        </div>
    {/if}
</div>
<div class="divider"></div>
<div class="section">
    <h4>Legal Documentation</h4>
    <p>Use this form to upload pictures or PDFs of legal documents, such as a driver's license, that match the infomation provided above. This step is also required to verify your identity before you can use our exchange. We will manually validate your account once this step is completed (expect a 24-hour wait at most). You can upload additional documents at any time before your identity is verified.</p>
    <div class="row">
        {#if !$session.user.verified}
            <FileUpload
                name="id"
                label="Attach a Photo"
                action="/api/profile/update/id"
                multiple
                accept="image/*"
                resolve={onUploadID}
                reject={onUploadFailed}
            />
        {:else}
            <button class="btn waves-effect waves-light" disabled>
                <i class="material-icons left">attach_file</i>
                Attach a Photo &hellip;
            </button>
            <p>You cannot upload additional legal documentation at this time, because you have already proven your identity. If you believe there is an error, or some of your information has changed since your identity was last verified, please contact support.</p>
        {/if}
    </div>
</div>
<div class="divider"></div>
<div class="section">
    <h4>Financial Information</h4>
    <p>You need to provide one or more addresses before you can send invoices.</p>
    <div class="row">
        <div class="input-field col s6">
            <input id="btc" name="btc" bind:value={btc} type="text">
            <label class={btc ? 'active' : ''} for="btc">Bitcoin Address</label>
        </div>
        <div class="input-field col s6">
            <input id="eth" name="eth" bind:value={eth} type="text">
            <label class={eth ? 'active' : ''} for="eth">Ethereum Address</label>
        </div>
    </div>
    <div class="row">
        <AjaxButton
            name="updateProfile"
            action="/api/profile/update/wallets"
            method="post"
            data={{ btc, eth }}
            resolve={() => { onSuccessfulUpdate('Financial info'); }}
            reject={onUploadFailed}
            classes="btn waves-effect waves-light"
        >
            Save
        </AjaxButton>
    </div>
</div>
<div class="divider"></div>
<div class="section">
    <a class="btn waves-effect waves-light" href="/profile">Cancel</a>
</div>
