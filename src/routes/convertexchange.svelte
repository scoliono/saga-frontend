<svelte:head>
    <title>Convert or Exchange | SAGA</title>
</svelte:head>

<script>
    import { stores } from '@sapper/app';
    const { session } = stores();
</script>

<style>
    div.panel {
        width: 60%;
        padding: 15px;
    }
</style>

<p class="title">Convert or Exchange</p>
<div class="panel has-background-white">
    {#if !$session.ce_confirmed}
        <div class="content has-background-white has-text-danger">
            <h3 class="has-text-danger">Disclaimer</h3>
            <p>placeholder</p>
            <hr>
            <div class="has-text-centered">
                <p>
                    <a on:click={() => { $session.ce_confirmed = true }}
                        class="button is-rounded is-info">
                        BTC/ETH &harr; SAGA Points
                    </a>
                </p>
                <p><a href="/support/guide1">SAGA Guide: SAGA Tokens and SAGA Points</a></p>
                <p><a href="/support/guide2">SAGA Guide: How to Convert or Exchange</a></p>
            </div>
        </div>
    {:else}
        <p class="subtitle has-text-weight-bold">Exchange</p>
        <div class="form">
            <div class="field">
                <div class="is-right dropdown">
                    <div class="dropdown-trigger">
                        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span>Select</span>
                            <span class="icon is-small">
                                <i class="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </button>
                    </div>
                    <div class="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                            <div class="dropdown-item">Local fiat</div>
                            <div class="dropdown-item">BTC</div>
                            <div class="dropdown-item">ETH</div>
                        </div>
                    </div>
                </div>
            </div>
            <p class="has-text-yellow">Balance: 0.00000000</p>
            <div class="field">
                <div class="columns">
                    <div class="column is-one-third">
                        <input class="input" type="text" name="quantity" placeholder="Quantity">
                    </div>
                    <div class="column is-one-third has-text-centered">
                        <span class="icon">
                            <i class="fas fa-2x fa-long-arrow-alt-right"></i>
                        </span>
                    </div>
                    <div class="column is-one-third">
                        <input class="input" disabled type="text" name="result" placeholder="Result">
                    </div>
                </div>
            </div>
        </div>
        <div class="field has-text-centered">
            <button class="button is-rounded is-info">Exchange</button>
        </div>
    {/if}
</div>
