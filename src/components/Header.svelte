<script>
    import { stores } from '@sapper/app';
    import { loading } from '../stores.js';
    import routes from '../routes.js';
    import Breadcrumb from './Breadcrumb.svelte';
    const { preloading, page, session } = stores();
</script>

<style>
    nav.navbar {
        margin-left: -24px;
        margin-bottom: 10px;
        flex-shrink: 0;
    }
    :global(body.has-navbar-fixed-top) {
        padding-top: 4rem;
    }
</style>

<nav class="navbar is-fixed-top is-white">
    <div class="navbar-menu">
        <div class="navbar-end">
            {#if $session.user}
                <a class="navbar-item" href="/profile">
                    <figure class="image is-32x32">
                        <img class="is-rounded" src={$session.user.avatar || '/saga-icon.svg'} alt={$session.user.full_name}>
                    </figure>
                    <span class="subtitle" style="margin-left:10px;">{$session.user.full_name}</span>
                </a>
                <div class="navbar-item">
                    <a class="button" href="/logout">
                        <span class="icon">
                            <i class="fas fa-sign-out-alt"></i>
                        </span>
                        <span>Logout</span>
                    </a>
                </div>
                <!--
                <div class="navbar-item" style="border-left:1px solid rgb(234, 234, 234);">
                    <span class="icon" style="margin-right:10px;">
                        <i class="fas fa-globe-americas"></i>
                    </span>
                    <div class="is-right dropdown">
                        <div class="dropdown-trigger">
                            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                <span>English</span>
                                <span class="icon is-small">
                                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <div class="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <div class="dropdown-item">English</div>
                            </div>
                        </div>
                    </div>
                </div>
                -->
            {:else}
                <div class="navbar-item">
                    <div class="field is-grouped">
                        <div class="control">
                            <a class="button"
                                class:is-link={$page.path === '/login'}
                                class:is-outlined={$page.path === '/login'}
                                href="/login">
                                Login
                            </a>
                        </div>
                        <div class="control">
                            <a class="button"
                                class:is-link={$page.path === '/register'}
                                class:is-outlined={$page.path === '/register'}
                                href="/register">
                                Register
                            </a>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</nav>

<Breadcrumb />
