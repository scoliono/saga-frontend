<svelte:head>
	<title>Home | SAGA</title>
</svelte:head>

<script>
	import { onMount } from 'svelte';
	import { goto, stores } from '@sapper/app';
	const { session, page } = stores();

	onMount(() => {
		if (!$session.user) {
            goto(`/login?redirect=${encodeURIComponent($page.path)}`);
        }
	});
</script>

<style>
	div.columns.panel div.column:not(:last-child) {
		border-right: 1px solid rgb(245, 245, 245);
	}
</style>

<div class="container">
	<h1 class="title">Dashboard</h1>
	<div class="columns panel has-background-white" style="width:70%;">
		<div class="column has-text-centered">
			<div class="field">
				<button class="button is-info is-rounded">Set up 2FA now</button>
			</div>
			<div class="field">
				<input id="remind-2fa" type="checkbox" class="switch is-rounded" checked="checked">
				<label for="remind-2fa">Remind me Later</label>
			</div>
		</div>
		<div class="column has-text-centered">
			<div class="field">
				<button class="button is-info is-rounded">Get Verified</button>
			</div>
			<div class="field">
				<input id="remind-verify" type="checkbox" class="switch is-rounded" checked="checked">
				<label for="remind-verify">Remind me Later</label>
			</div>
		</div>
		<div class="column has-text-centered">
			<div class="field">
				<button class="button is-info is-rounded">Switch plans</button>
			</div>
			<div class="field">
				<input id="remind-upgrade" type="checkbox" class="switch is-rounded">
				<label for="remind-upgrade">Don't remind me</label>
			</div>
		</div>
	</div>
	<div class="columns is-multiline">
		<div class="column is-one-third">
			<div class="card">
				<header class="card-header">
					<p class="card-header-title">
						<span class="icon">
							<i class="fas fa-dollar-sign"></i>
						</span>
						Local fiat
					</p>
					<a class="card-header-icon" aria-label="more options">
						<span class="icon">
							<i class="fas fa-angle-right" aria-hidden="true"></i>
						</span>
					</a>
				</header>
				<div class="card-content">
					<div class="content has-text-right">
						$<span class="is-size-2">1,000.00</span> USD
					</div>
				</div>
			</div>
		</div>
		<div class="column is-one-third">
			<div class="card">
				<header class="card-header">
					<p class="card-header-title">
						<span class="icon">
							<i class="fab fa-bitcoin"></i>
						</span>
						Bitcoin
					</p>
					<a class="card-header-icon" aria-label="more options">
						<span class="icon">
							<i class="fas fa-angle-right" aria-hidden="true"></i>
						</span>
					</a>
				</header>
				<div class="card-content">
					<div class="content has-text-right">
						<span class="is-size-2">0.00000000</span> BTC
					</div>
				</div>
			</div>
		</div>
		<div class="column is-one-third">
			<div class="card">
				<header class="card-header">
					<p class="card-header-title">
						<span class="icon">
							<i class="fab fa-ethereum"></i>
						</span>
						Ethereum
					</p>
					<a class="card-header-icon" aria-label="more options">
						<span class="icon">
							<i class="fas fa-angle-right" aria-hidden="true"></i>
						</span>
					</a>
				</header>
				<div class="card-content">
					<div class="content has-text-right">
						<span class="is-size-2">0.00000000</span> ETH
					</div>
				</div>
			</div>
		</div>
		<div class="column is-one-third">
			<div class="card">
				<header class="card-header">
					<p class="card-header-title">
						<span class="icon">
							<img src="/saga-icon.svg">
						</span>
						SAGA Token
					</p>
					<a class="card-header-icon" aria-label="more options">
						<span class="icon">
							<i class="fas fa-angle-right" aria-hidden="true"></i>
						</span>
					</a>
				</header>
				<div class="card-content">
					<div class="content has-text-right">
						<span class="is-size-2">0.00000000</span> ST
					</div>
				</div>
			</div>
		</div>
		<div class="column is-one-third">
			<div class="card">
				<header class="card-header">
					<p class="card-header-title">
						<span class="icon">
							<img src="/saga-icon.svg">
						</span>
						SAGA Points
					</p>
					<a class="card-header-icon" aria-label="more options">
						<span class="icon">
							<i class="fas fa-angle-right" aria-hidden="true"></i>
						</span>
					</a>
				</header>
				<div class="card-content">
					<div class="content has-text-right">
						<span class="is-size-2">0.00000000</span> SP
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
