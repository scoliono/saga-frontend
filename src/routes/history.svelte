<script>
    import Receipt from '../components/Receipt.svelte';
    import AjaxButton from '../components/AjaxButton.svelte';
    import CardModal from '../components/CardModal.svelte';
    import InputField from '../components/InputField.svelte';
    import * as api from '../api.js';
    import { onMount } from 'svelte';
    import { stores } from '@sapper/app';
    const { session } = stores();

    let loading = true;
    let receipts = [];
    let deposits = true;
    $: type = deposits ? 'Deposits' : 'Withdraws';

    let exportModal;
    const newDateString = () => new Date().toLocaleDateString('en-CA');
    let endDate = newDateString();
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate = startDate.toLocaleDateString('en-CA');

    let errors = [];

    async function getReceipts()
    {
        loading = true;
        receipts = (await api.get(`/api/order/${deposits ? 'outgoing' : 'incoming'}`)).orders;
        loading = false;
    }

    onMount(async () => {
        try {
            await getReceipts();
        } catch (err) {
            console.error(err);
            bulmaToast({
                type: 'is-danger',
                message: err.toString()
            });
        }
    });
</script>

<svelte:head>
    <title>Transaction History | SAGA</title>
</svelte:head>

<div class="content">
<h1>Transaction History</h1>
<div class="level">
    <div class="level-left">
        <div class="field">
            <label for="type">Withdraws</label>
            <input class="switch" type="checkbox" id="type" bind:checked={deposits} on:change={getReceipts}>
            <label for="type">Deposits</label>
        </div>
    </div>
    <div class="level-right">
        <button class="button is-info is-rounded" on:click={exportModal.open}>
            <span class="icon">
                <i class="fas fa-download"></i>
            </span>
            <span>Export to Spreadsheet&hellip;</span>
        </button>
    </div>
</div>
{#if loading}
    <p>Loading&hellip;</p>
{:else}
    {#if !receipts.length}
        <p class="has-text-weight-bold">No receipts found.</p>
    {:else}
        <table class="table is-hoverable">
            <colgroup>
                <col span="1" style="width: 5%;">
                <col span="1" style="width: 10%;">
                <col span="1" style="width: 10%;">
                <col span="1" style="width: 15%;">
                <col span="1" style="width: 15%;">
                <col span="1" style="width: 15%;">
                <col span="1" style="width: 10%;">
                <col span="1" style="width: 5%;">
                <col span="1" style="width: 5%;">
                <col span="1" style="width: 10%;">
            </colgroup>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Date</th>
                    <th>Paid On</th>
                    <th>Payer Email</th>
                    <th>Payer Address</th>
                    <th>Collector Address</th>
                    <th>Total Amount</th>
                    <th>Currency</th>
                    <th>Paid?</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {#each receipts as data, i}
                <Receipt {data} num={i + 1} currency="SAGA" {type} />
            {/each}
            </tbody>
        </table>
    {/if}
{/if}
</div>

<!-- Begin modals -->
<CardModal bind:this={exportModal} title="Export to Spreadsheet">
    <section class="modal-card-body">
        <form>
            <InputField
                name="start"
                label="From:"
                type="date"
                horizontal
                bind:value={startDate}
                bind:error={errors.start}
                placeholder="2020-01-01"
                max={endDate}
            />
            <InputField
                name="end"
                label="To:"
                type="date"
                horizontal
                bind:value={endDate}
                bind:error={errors.end}
                placeholder={newDateString()}
                min={startDate}
                max={newDateString()}
            />
        </form>
    </section>
    <footer class="modal-card-foot">
        <a
            class="button is-info"
            href={`/api/order/export?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`}
        >
            Export
        </a>
    </footer>
</CardModal>
<!-- End modals -->
