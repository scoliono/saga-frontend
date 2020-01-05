<script>
	import Nav from '../components/Nav.svelte';
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	import { onMount } from 'svelte';

	export let segment;

    import * as api from '../api.js';
    import { goto, stores } from '@sapper/app';
	const { session } = stores();
</script>

<style>
	div.column {
		padding-bottom: 0;
		min-height: 100%;
		max-height: calc(100vh - 4rem);
		overflow: scroll;
		flex-direction: column;
		background-color: rgb(237, 237, 237);
	}
	main {
		flex-grow: 1;
		padding: 0 12px;
	}
</style>

<div class="columns is-paddingless">
	<Nav {segment}/>
	<div class="column is-flex">
		<Header />
		<main>
			<div class="container">
				<slot></slot>
			</div>
		</main>
		<Footer />
	</div>
</div>
