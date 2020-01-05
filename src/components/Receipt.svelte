<script>
    export let id, from_name, from_email, from_address, value, receipt_list, created_at, updated_at, completed, to_address;
</script>

<style>
code {
    word-wrap: break-word;
}
</style>

<ul class="collapsible expandable">
    <li class="active">
        <div class="collapsible-header row">
            <i class="material-icons left">info_outline</i>
            Order Info
            {#if completed}
                <div class="col s2">
                    <i class="material-icons left green-text">check_circle</i>
                    Paid
                </div>
            {/if}
        </div>
        <div class="collapsible-body">
            <div class="row">
                <div class="col s12">
                    <label>Order ID:</label> <code>{id}</code>
                </div>
            </div>
            <div class="row">
                <div class="col s6">
                    <label>Customer Name:</label> {from_name}
                </div>
                <div class="col s6">
                    <label>Customer Email:</label> <a href={`mailto:${from_email}`}>{from_email}</a>
                </div>
            </div>
            <div class="row">
                <div class="col s6">
                    <label>Customer ETH Address:</label> <code>{from_address}</code>
                </div>
                <div class="col s6">
                    <label>Merchant ETH Address:</label> <code>{to_address}</code>
                </div>
            </div>
            <div class="row">
                <div class="col s12">
                    <label>Total Value Owed:</label> {value} SAGA
                </div>
            </div>
            <div class="row">
                <div class="col s6">
                    <label>Invoice Sent At:</label> {new Date(created_at).toLocaleString()}
                </div>
            </div>
        </div>
    </li>
    <li>
        <div class="collapsible-header">
            <i class="material-icons left">receipt</i>
            Order Receipt ({receipt_list.length > 1 ? `${receipt_list.length} items` : '1 item'})
        </div>
        <div class="collapsible-body">
            {#each receipt_list as item}
                <p><label>{item.name}:</label> {item.price} SAGA</p>
            {/each}
        </div>
    </li>
</ul>