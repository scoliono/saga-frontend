<script context="module">
    export function preload(page, session)
    {
        //TODO: Verify signature before attempting to confirm
        let { signature } = page.params;

    }
</script>

<script>
    import { goto, stores } from '@sapper/app';
    import AjaxButton from '../../../components/AjaxButton.svelte';
    import * as api from '../../../api.js';
    import { onMount } from 'svelte';
    const { session, page, preloading } = stores();

    let { order_id } = $page.params;
    let { signature } = $page.query;
    let tx;
    let status;

    onMount(async () => {
        try {
            let json = await api.get(`/api/order/${order_id}/confirm?signature=${signature}`);
            tx = json.tx;
        } catch (err) {
            bulmaToast({
                message: err.message || 'Failed to load transaction data',
                type: 'is-danger'
            });
        }
        window.Echo.channel(`saga_database_order.${order_id}`)
        .listen('PaymentStatusUpdated', e => {
            bulmaToast({
                message: `Payment ${e.update.payment_status}`,
                type: ['failed', 'expired'].includes(e.update.payment_status) ? 'is-danger' : 'is-success',
                position: 'top-center',
                dismissible: true,
                pauseOnHover: true,
                animate: { in: 'fadeIn', out: 'fadeOut' },
                duration: 5000
            });
            status = e.update.payment_status;
            if (e.update.payment_status === 'confirmed') {
                window.onbeforeunload = null;
            }
        });
        window.onbeforeunload = () => 'Your payment has not yet been confirmed. Are you sure you want to exit?';
    });

    function onPaymentConfirmed(data)
    {
        bulmaToast(`Redirecting to <a target="_blank" href="${data.url}">payment gateway</a>...`);
        setTimeout(() => {
            window.open(data.url, '_blank').focus();
        }, 2000);
    }

    function onPaymentConfirmationFailed(err)
    {
        bulmaToast({
            message: err.message || 'Could not confirm payment.',
            type: 'is-danger'
        });
    }
</script>

<svelte:head>
    <title>Confirm Invoice | SAGA</title>
</svelte:head>

<style>
</style>

<nav class="panel">
    <p class="panel-heading">Confirm Invoice</p>
    {#if tx}
    <div class="panel-block">
        <div class="columns">
            <div class="column is-narrow">
                <small>FROM</small>
                <p class="has-text-weight-bold">{tx.merchant.full_name}</p>
                <p>{tx.merchant.location}</p>
                <p>{tx.merchant.phone}</p>
            </div>
            <div class="column is-narrow">
                <small>TO</small>
                <p class="has-text-weight-bold">{tx.from_name}</p>
                <p><a href={`mailto:${tx.from_email}`}>{tx.from_email}</a></p>
            </div>
        </div>
    </div>
    <div class="panel-block">
        <div class="content">
            <p><span class="has-text-weight-bold">Invoice #:</span> {tx.id}</p>
            <p><span class="has-text-weight-bold">Date:</span> {tx.created_at}</p>
        </div>
    </div>
    <div class="panel-block">
        <table class="table is-fullwidth is-hoverable">
            <thead>
                <tr>
                    <th style="width:60%;">DESCRIPTION</th>
                    <th style="width:15%;">RATE</th>
                    <th style="width:10%;">QTY</th>
                    <th style="width:15%;">AMOUNT</th>
                </tr>
            </thead>
            <tbody>
                {#each tx.receipt_list as item}
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.rate} SAGA</td>
                        <td>{item.quantity}</td>
                        <td>{Math.round(item.rate * item.quantity * 100 + Number.EPSILON ) / 100} SAGA</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class="panel-block">
        <div class="content">
            <p class="has-text-weight-bold">Discounts / Fees Applied</p>
            <ul>
                {#if tx.discount_list && tx.discount_list.length > 0}
                    {#each tx.discount_list as { name, rate }}
                        <li class:has-text-danger={rate > 0.0}>
                            <span class="has-text-weight-bold">{name}</span>: {rate * 100}%
                        </li>
                    {/each}
                {:else}
                    <li>No discounts or fees were applied.</li>
                {/if}
            </ul>
        </div>
    </div>
    <div class="panel-block">
        <div class="columns" style="margin-left:auto;">
            <div class="column has-text-right is-narrow">
                <p class="has-text-weight-bold">Total</p>
                <p class="subtitle">Balance Due</p>
            </div>
            <div class="column has-text-left is-narrow">
                <p class="has-text-weight-bold">{tx.value} SAGA</p>
                <p class="subtitle">{tx.value} SAGA</p>
            </div>
        </div>
    </div>
    {:else}
        <div class="panel-block">
            Loading transaction data&hellip;
        </div>
    {/if}
</nav>
<div class="is-pulled-right">
    <form class:is-hidden={status}>
        <div class="control">
            <AjaxButton
                method="post"
                action={`/api/order/${order_id}/confirm?signature=${signature}`}
                resolve={onPaymentConfirmed}
                reject={onPaymentConfirmationFailed}
                submit
            >
                Confirm
            </AjaxButton>
        </div>
    </form>
    <p class:is-hidden={status !== 'confirmed'}>Payment confirmed successfully. You may now close this window.</p>
</div>
<p class:is-hidden={!status}>Payment status: <span class="has-text-weight-bold">{status}</span></p>
