<script context="module">
    export function preload(page, session)
    {
        if (!session.user) {
            this.redirect(302, '/login');
        }
    }
</script>

<svelte:head>
    <title>Convert or Exchange Disclaimer | SAGA</title>
</svelte:head>

<style>
    div.content {
        width: 60%;
        padding: 15px;
    }
</style>

<p class="title">Convert or Exchange</p>
<div class="content has-background-white has-text-danger">
    <h3 class="has-text-danger">Disclaimer</h3>
    <p>placeholder</p>
    <hr>
    <div class="has-text-centered">
        <p><a href="/convertexchange" class="button is-rounded is-info">BTC/ETH &harr; SAGA Points</a></p>
        <p><a href="/support/guide1">SAGA Guide: SAGA Tokens and SAGA Points</a></p>
        <p><a href="/support/guide2">SAGA Guide: How to Convert or Exchange</a></p>
    </div>
</div>
