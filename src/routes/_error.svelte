<script>
	export let status;
	export let error;

	const dev = process.env.NODE_ENV === 'development';
</script>

<svelte:head>
	<title>{status} {error.message}</title>
</svelte:head>

<h1 class="title">Error {status}</h1>
<p class="subtitle">{error.message}</p>

{#if dev && error.stack}
	<pre>{error.stack}</pre>
{/if}
