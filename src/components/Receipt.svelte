<script>
    import CardModal from './CardModal.svelte';
    import InputField from './InputField.svelte';

    export let num;
    export let data;
    export let currency;
    export let type;
    let { id, from_name, from_email, customer, merchant, from_address, value, memo,
        receipt_list, created_at, updated_at, to_address, tx_hash, discount_list } = data;
    let payerEmail = from_email || customer.email;

    let detailsModal;
</script>

<style>
    td {
        word-break: break-all;
    }
</style>

<tr>
    <td>{num}</td>
    <td>{new Date(created_at).toLocaleDateString('en-CA')}</td>
    <td>
        {#if updated_at && tx_hash}
            {new Date(updated_at).toLocaleDateString('en-CA')}
        {:else}
            (not paid)
        {/if}
    </td>
    <td><a href={`mailto:${from_email}`}>{from_email}</a></td>
    <td>{from_address || '(unknown)'}</td>
    <td>{to_address}</td>
    <td>{new Number(value).toFixed(2)}</td>
    <td>{currency}</td>
    <td>
        {#if updated_at && tx_hash}
            <span class="icon has-text-success">
                <i class="fas fa-check-circle"></i>
            </span>
        {:else}
            <span class="icon has-text-danger">
                <i class="fas fa-times-circle"></i>
            </span>
        {/if}
    </td>
    <td>
        <button class="button is-rounded" on:click={detailsModal.open}>
            View Details
        </button>
    </td>
</tr>

<!-- Begin modals -->
<CardModal
    bind:this={detailsModal}
    title={`Order #${num}`}
>
    <section class="modal-card-body">
        <h2>Memo</h2>
        <p>{memo || 'No memo was provided.'}</p>
        <h2>Items Purchased</h2>
        <ul>
            {#each receipt_list as { quantity, name, rate }}
                <li>
                    {quantity}&times;
                    <span class="has-text-weight-bold">{name}</span>
                    @ {rate} {currency} each
                </li>
            {/each}
        </ul>
        <h2>Discounts / Fees Applied</h2>
        <ul>
            {#if discount_list && discount_list.length > 0}
                {#each discount_list as { name, rate }}
                    <li class:has-text-danger={rate > 0.0}>
                        <span class="has-text-weight-bold">{name}</span>: {rate * 100}%
                    </li>
                {/each}
            {:else}
                <li>No discounts or fees were applied.</li>
            {/if}
        </ul>
        <h3>Total: {value} {currency}</h3>
        <hr>
        <h2>Metadata</h2>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">ID</label>
            </div>
            <div class="field-body">
                <input class="input" type="text" disabled value={id}>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Status</label>
            </div>
            <div class="field-body">
                <input class="input" type="text" disabled value={tx_hash ? 'Paid' : 'Not paid'}>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Created At</label>
            </div>
            <div class="field-body">
                <input class="input" type="text" disabled value={created_at}>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Paid At</label>
            </div>
            <div class="field-body">
                <input class="input" type="text" disabled value={tx_hash ? updated_at : '(not paid)'}>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Type</label>
            </div>
            <div class="field-body">
                <input class="input" type="text" disabled value={type}>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Total Amount</label>
            </div>
            <div class="field-body">
                <input class="input" type="text" disabled value={value}>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Currency</label>
            </div>
            <div class="field-body">
                <input class="input" type="text" disabled value={currency}>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Payer Name</label>
            </div>
            <div class="field-body">
                <input class="input" type="text" disabled value={from_name || customer.full_name}>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Payer Email</label>
            </div>
            <div class="field-body">
                <input class="input" type="text" disabled value={from_email || customer.email}>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Payer Address</label>
            </div>
            <div class="field-body">
                <input class="input" type="text" disabled value={from_address || '(not paid)'}>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Collector Address</label>
            </div>
            <div class="field-body">
                <input class="input" type="text" disabled value={to_address}>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Transaction Hash</label>
            </div>
            <div class="field-body">
                <input class="input" type="text" disabled value={tx_hash || '(not paid)'}>
            </div>
        </div>
    </section>
</CardModal>
<!-- End modals -->
