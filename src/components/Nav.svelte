<script>
	export let segment;
	import { stores } from '@sapper/app';
	import { loading } from '../stores.js';
	const { preloading, page, session } = stores();
</script>

<nav role="navigation">
	<div class="nav-wrapper">
		<a href="/" class="brand-logo">SAGA</a>
		<a href="#" on:click|preventDefault data-target="mobile-demo" class="sidenav-trigger">
			<i class="material-icons">menu</i>
		</a>
		<ul class="right hide-on-med-and-down">
			{#if $session.user}
				<li class='{segment === "dashboard" ? "active" : ""}'>
					<a rel=prefetch class='btn-flat' href='/dashboard'>Dashboard</a>
				</li>
				<li class='{segment === "profile" ? "active" : ""}'>
					<a rel=prefetch href='/profile' class='btn-flat'>
						<i class="material-icons left">account_circle</i>
						Profile
					</a>
				</li>
				<li>
					<a href='/logout' class='btn-flat'>
						<i class="material-icons left">exit_to_app</i>
						Logout
					</a>
				</li>
			{:else}
				<li class='{segment === "login" ? "active" : ""}'>
					<a rel=prefetch href='/login' class='btn-flat'>
						<i class="material-icons left">account_circle</i>
						Login
					</a>
				</li>
				<li class='{segment === "register" ? "active" : ""}'>
					<a rel=prefetch href='/register' class='btn-flat'>
						Register
					</a>
				</li>
			{/if}
		</ul>
		{#if $preloading || $loading}
			<div class="progress">
				<div class="indeterminate"></div>
			</div>
		{/if}
	</div>
</nav>

<ul class="sidenav" id="mobile-demo">
	{#if $session.user}
		<li class='{segment === "dashboard" ? "active" : ""}'>
			<a rel=prefetch class='btn-flat' href='/dashboard'>Dashboard</a>
		</li>
		<li class='{segment === "profile" ? "active" : ""}'>
			<a rel=prefetch href='/profile' class='btn-flat'>
				<i class="material-icons left">account_circle</i>
				Profile
			</a>
		</li>
		<li>
			<a href='/logout' class='btn-flat'>
				<i class="material-icons left">exit_to_app</i>
				Logout
			</a>
		</li>
	{:else}
		<li class='{segment === "login" ? "active" : ""}'>
			<a rel=prefetch href='/login' class='btn-flat'>
				<i class="material-icons left">account_circle</i>
				Login
			</a>
		</li>
		<li class='{segment === "register" ? "active" : ""}'>
			<a rel=prefetch href='/register' class='btn-flat'>
				Register
			</a>
		</li>
	{/if}
</ul>
