<script>
    import { goto, stores } from '@sapper/app';
    const { session } = stores();

    // TODO prevent route from loading if user isn't logged in
</script>

<svelte:head>
    <title>My Profile</title>
</svelte:head>

<h1>Profile</h1>
<p>Hello <span style="font-weight:500;">{$session.user.name}</span></p>
{#if process.env.NODE_ENV === 'development'}
    <p>Debug:</p>
    <pre>
        { JSON.stringify($session.user, null, 2) }
    </pre>
{/if}