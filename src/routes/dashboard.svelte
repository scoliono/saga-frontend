<script context="module">
    export function preload(page, session)
    {
        if (!session.user) {
            this.redirect(302, '/login');
        }
    }
</script>

<script>
    import { goto, stores } from '@sapper/app';
    const { session } = stores();
    let value = '';
    let rev;
    $: rev = value.split('').reverse().join('');
</script>

<svelte:head>
    <title>Dashboard | SAGA</title>
</svelte:head>

<h1>Dashboard</h1>
<input type="text" bind:value>
<p>{rev}</p>