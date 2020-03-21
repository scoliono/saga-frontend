<svelte:head>
	<title>SAGA Pay</title>
</svelte:head>

<script>
	import Login from './login.svelte';
	import Register from './register.svelte';
	import { onMount } from 'svelte';
	import { stores, goto } from '@sapper/app';

	const { session } = stores();

	let personal = true;
	let createAcc = false;
</script>

<style>
	.hero-body {
		flex-direction: row;
		justify-content: center;
		align-items: center;
		z-index: 1;
	}
	.hero-circle {
		position: absolute;
		background-color: lightskyblue;
		margin-top: -250px;
		height: 500px;
		width: 500px;
		margin-left: calc(50% - 250px);
		border-radius: 50%;
		z-index: 0;
	}
	figure.image {
		margin-right: 15px;
	}
	p.brand {
		font-size: 56px;
		margin-left: 15px;
		color: whitesmoke;
		font-weight: 300;
		letter-spacing: 5px;
	}
	div.panel-block {
		flex-direction: column;
		min-width: 350px;
	}
	:global(div.panel-block div.content) {
		width: 100%;
	}
	section.hero {
		margin-top: -4rem;
	}
</style>

<section class="hero">
	<div class="hero-body is-flex">
		<figure class="image is-128x128">
			<img alt="SAGA Logo" src="/saga-icon.svg">
		</figure>
		<p class="brand">SAGA</p>
	</div>
	<div class="hero-circle"></div>
</section>
<section class="section">
	<nav class="level is-mobile">
		<div class="level-item has-text-centered">
			<nav class="panel has-text-left">
				<p class="panel-tabs">
					<a class:is-active={personal} on:click={() => personal = true}>Personal</a>
					<a class:is-active={!personal} on:click={() => personal = false}>Business</a>
				</p>
				<div class="panel-block">
					{#if !createAcc}
						<Login {personal} />
						<p>Need an account? <a on:click={() => createAcc = true}>Register</a></p>
					{:else}
						<Register {personal} />
						<p>Already have an account? <a on:click={() => createAcc = false}>Login</a></p>
					{/if}
				</div>
			</nav>
		</div>
	</nav>
</section>
