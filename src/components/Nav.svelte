<script>
	import { stores } from '@sapper/app';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { loading } from '../stores.js';
	import routes from '../routes.js';
	import * as api from '../api.js';
	const { preloading, page, session } = stores();

	let column;
	$session.expanded = !!$session.expanded;
	let expand = $session.expanded;

	onMount(() => {
		if ($session.expanded) {
			column.style.flex = '0.2';
		}
	});

	function toggleExpanded()
	{
		expand = !$session.expanded;
		$session.expanded = false;
		if (expand) {
			column.style.flex = '0.2';
		} else {
			column.style.flex = '';
		}
		setTimeout(async () => {
			$session.expanded = expand;
			try {
				await api.setSessionVar('expanded', expand);
			} catch (err) {
				console.warn('Failed to update session var "expanded": ' + err);
			}
		}, 500);
	}
</script>

<style>
	div.column {
		padding-right: 0;
		padding-bottom: 0;
		background-color: rgb(237, 237, 237);
		transition: flex 0.5s ease-out;
		flex: 0;
		position: sticky;
		margin-top: -4rem;
		z-index: 99;
		max-height: 100%;
	}
	aside.menu {
		height: 100vh;
		max-height: 100vh;
		overflow: scroll;
	}
	ul.menu-list {
		flex-direction: column;
		align-items: flex-start;
	}
	img.logo {
		height: 28px;
		width: 28px;
		margin: 0 auto;
	}
	div.logo {
		padding: 0 10px;
	}
	span.logo {
		margin-left: 10px;
		width: 100%;
		letter-spacing: 3px;
		font-size: 22px;
	}
	li.logo {
		display: flex;
		height: 3.5rem;
	}
	li.route {
		width: 100%;
	}
	li.bottom {
		position: absolute;
		bottom: 0;
	}
</style>

<div class="column is-hidden-mobile" bind:this={column}>
	<aside class="menu has-background-dark">
		<ul class="menu-list is-flex">
			<li class="logo">
				<div class="logo level">
					<img class="logo is-pulled-left" src="/saga-icon.svg" alt="SAGA Logo">
					{#if $session.expanded}
						<span in:fade class="logo is-hidden-touch is-pulled-left title has-text-light has-text-bold">SAGA</span>
					{/if}
				</div>
			</li>
			{#each Object.values(routes).filter(r => !r.hidden) as route}
				<li class="route">
					<a class:is-active={$page.path === route.slug}
						href={route.slug}
						title={route.label}>
						<span class="icon is-medium">
							<i class={`fas fa-lg fa-${route.icon}`}></i>
						</span>
						{#if $session.expanded}
							<span>{route.label}</span>
							{#if route.subitems}
								<span class="is-pulled-right icon" on:click={toggleExpanded}>
									{#if expand}
										<i class="fas fa-angle-down"></i>
									{:else}
										<i class="fas fa-angle-up"></i>
									{/if}
								</span>
							{/if}
						{/if}
					</a>
					{#if $session.expanded && route.subitems}
						<ul>
							{#each Object.values(route.subitems) as subroute}
								<li in:fly>
									<a href={`${route.slug}${subroute.slug}`}>{subroute.label}</a>
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
			<li class="bottom has-background-dark">
				<a on:click={toggleExpanded}>
					<span class="icon is-medium">
						{#if expand}
							<i class="fas fa-lg fa-angle-double-left"></i>
						{:else}
							<i class="fas fa-lg fa-angle-double-right"></i>
						{/if}
					</span>
				</a>
			</li>
		</ul>
	</aside>
</div>
