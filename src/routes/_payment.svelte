<svelte:head>
    <title>Payment Methods | SAGA</title>
</svelte:head>

<style>
    table.table {
        width: 60%;
        line-height: 3em;
    }
</style>

<div class="container">
    <p class="title">Payment Methods</p>
    <table class="table">
        <tbody>
            <tr><td>
                <div class="is-pulled-left">
                    <span class="icon">
                        <i class="fas fa-lg fa-dollar-sign"></i>
                    </span>
                    Local fiat
                </div>
                <div class="is-pulled-right">
                    <input type="checkbox" class="switch is-rounded" checked="checked">
                    <label></label>
                </div>
            </td></tr>
            <tr><td>
                <div class="is-pulled-left">
                    <span class="icon">
                        <i class="fab fa-lg fa-bitcoin"></i>
                    </span>
                    Bitcoin
                </div>
                <div class="is-pulled-right">
                    <input type="checkbox" class="switch is-rounded" checked="checked">
                    <label></label>
                </div>
            </td></tr>
            <tr><td>
                <div class="is-pulled-left">
                    <span class="icon">
                        <i class="fab fa-lg fa-ethereum"></i>
                    </span>
                    Ethereum
                </div>
                <div class="is-pulled-right">
                    <input type="checkbox" class="switch is-rounded" checked="checked">
                    <label></label>
                </div>
            </td></tr>
            <tr><td>
                <div class="is-pulled-left">
                    <span class="icon">
                        <img src="/saga-icon.svg">
                    </span>
                    SAGA Token
                </div>
                <div class="is-pulled-right">
                    <input type="checkbox" class="switch is-rounded" checked="checked">
                    <label></label>
                </div>
            </td></tr>
            <tr><td>
                <div class="is-pulled-left">
                    <span class="icon">
                        <img src="/saga-icon.svg">
                    </span>
                    SAGA Points
                </div>
                <div class="is-pulled-right">
                    <input type="checkbox" class="switch is-rounded" checked="checked">
                    <label></label>
                </div>
            </td></tr>
        </tbody>
    </table>
</div>
