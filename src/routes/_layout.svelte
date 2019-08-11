<script>
	import Nav from '../components/Nav.svelte';
	import { onMount } from 'svelte';

	export let segment;
</script>

<Nav {segment}/>

<main>
	<div class="container">
		<slot></slot>
	</div>
</main>