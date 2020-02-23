<script>
    import { stores } from '@sapper/app';
    import routes from '../routes.js';
    const { preloading, page, session } = stores();
    $: route = routes[$page.path];
</script>

<nav class="breadcrumb has-succeeds-separator" aria-label="breadcrumbs">
  <ul>
    <li>
        <span class="icon"><i class="fas fa-home"></i></span>
        <a href="/">Home</a>
    </li>
    {#if route && route.label !== 'Home'}
        <li class="is-active">
            <a href={route.slug}>{route.label}</a>
        </li>
    {/if}
  </ul>
</nav>
