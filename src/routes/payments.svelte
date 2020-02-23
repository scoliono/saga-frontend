<script context="module">
    export function preload(page, session)
    {
        // Verify signature
        let { signature } = page.params;

    }
</script>

<script>
    import { goto, stores } from '@sapper/app';
    import AjaxButton from '../components/AjaxButton.svelte';
    import * as api from '../api.js';
    import { onMount } from 'svelte';
    const { session, page, preloading } = stores();

    let { signature, order_id } = $page.params;
    let tx = {};

    Echo.channel(`saga_database_order.${order_id}`)
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
        status_label.parentElement.classList.remove('is-hidden');
        if (e.update.payment_status === 'confirmed') {
            form.classList.add('is-hidden');
            form.parentElement.innerHTML = 'Payment confirmed successfully. You may now close this window.';
            window.onbeforeunload = null;
        }
        status_label.innerHTML = e.update.payment_status;
    });

    window.onbeforeunload = () => 'Your payment has not yet been confirmed. Are you sure you want to exit?';
</script>

<svelte:head>
Confirm Invoice
</svelte:head>

<style>
</style>

<nav class="panel">
    <p class="panel-heading">Confirm Invoice</p>
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
                <p class="has-text-weight-bold">{tx.customer.full_name}</p>
                <p><a href={`mailto:${tx.customer.email}`}>{tx.customer.email}</a></p>
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
        <div class="columns" style="margin-left:auto;">
            <div class="column has-text-right is-narrow">
                <p class="has-text-weight-bold">Total</p>
                <p class="subtitle">Balance Due</p>
            </div>
            <div class="column has-text-left is-narrow">
                <p class="has-text-weight-bold">{tx.value} SAGA</p>
                <!-- allow for deductions, discounts -->
                <p class="subtitle">{tx.value} SAGA</p>
            </div>
        </div>
    </div>
</nav>
<div class="is-pulled-right">
    <form>
        <div class="control">
            <AjaxButton
                method="post"
                action="http://localhost:8000/payments/"
                resolve={onPaymentConfirmed}
                reject={onPaymentConfirmationFailed}
                submit
            >
                Confirm
            </AjaxButton>
        </div>
    </form>
</div>
<p class="is-hidden">Payment status: <span id="status" class="has-text-weight-bold"></span></p>
