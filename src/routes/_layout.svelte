<script context="module">
	import * as api from '../api.js';

	export async function preload(page, session) {
        try {
			const user = await api.user();
			session.user = user;
        } catch (e) {
			session.user = null;
		}
    }
</script>

<script>
	import Nav from '../components/Nav.svelte';
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	import LoadingBar from '../components/LoadingBar.svelte';
	import { onMount } from 'svelte';
	import routes from '../routes.js';

    import { goto, stores } from '@sapper/app';
	const { session, page, preloading } = stores();

	if (typeof window !== "undefined" && typeof document !== "undefined") {
		page.subscribe(({ path, params, query }) => {
			// check auth for every page load
			const route = routes[window.location.pathname];
			if (route) {
				if (route.protected && !$session.user) {
					goto(`/login?redirect=${encodeURIComponent(route.slug)}`);
				} else if (route.guest && $session.user) {
					goto(query.redirect ? decodeURIComponent(query.redirect) : '/dashboard');
				}
			}
		});
	}
</script>

<style>
	div.column {
		padding-bottom: 0;
		min-height: 100%;
		max-height: calc(100vh - 3rem);
		overflow: scroll;
		flex-direction: column;
		background-color: rgb(237, 237, 237);
	}
	main {
		flex-grow: 1;
		padding: 0 12px;
		margin-bottom: 3em;
	}
</style>

{#if $preloading}
<LoadingBar />
{:else}
	{#if $page.path === '/'}
	<slot></slot>
	{:else}
	<div class="columns is-paddingless">
		<Nav />
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
	{/if}
{/if}
