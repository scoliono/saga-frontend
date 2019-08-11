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

    onMount(() => {
        setInterval(init, 100);
    });

    function init()
    {
        let elems = document.querySelectorAll('.collapsible.expandable');
        M.Collapsible.init(elems, {
            accordion: false
        });
    }

    async function fetchOrders()
    {
        api.setToken($session.token);
        const res = await api.post('/api/order/showall');
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
                        to_name={order.to_name}
                        to_email={order.to_email}
                        value={order.value}
                        to_address={order.to_address}
                        receipt_list={order.receipt_list}
                        created_at={order.created_at}
                        updated_at={order.updated_at}
                        completed={order.completed}
                    />
                </li>
            {/each}
        </ul>
    {/if}
{:catch err}
    <p><strong>Error:</strong> {err.message}</p>
{/await}
