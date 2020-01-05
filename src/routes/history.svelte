<script context="module">
    export function preload(page, session)
    {
        if (!session.user) {
            this.redirect(302, '/login');
        }
    }
</script>

<script>
    import Receipt from '../components/Receipt.svelte';
    import * as api from '../api.js';
    import { onMount } from 'svelte';
    import { stores } from '@sapper/app';
    const { session } = stores();

    async function fetchOrders()
    {
        api.setToken($session.token);
        const res = await api.get('/api/payments/all');
        return res.orders;
    }

</script>

<h2>Receipts</h2>
{#await fetchOrders()} 
    <p>Loading&hellip;</p>
{:then orders}
    {#if !orders.length}
        No receipts found.
    {:else}
        <ul class="collection">
            {#each orders as order}
                <li class="collection-item">
                    <Receipt
                        id={order.id}
                        from_name={order.name}
                        from_email={order.email}
                        value={order.value}
                        from_address={order.from_address}
                        to_address={order.to_address}
                        receipt_list={order.receipt_list}
                        created_at={order.create_date}
                        updated_at={order.update_date}
                        completed={order.tx_hash !== 'unconfirmed'}
                    />
                </li>
            {/each}
        </ul>
    {/if}
{:catch err}
    <p><strong>Error:</strong> {err.message}</p>
{/await}
