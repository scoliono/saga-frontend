<script context="module">
    export function preload(page, session)
    {
        if (!session.user) {
            this.redirect(302, '/login');
        }
    }
</script>

<script>
    import { goto, stores } from '@sapper/app';
    import AjaxButton from '../components/AjaxButton.svelte';
    import * as api from '../api.js';
    import { onMount } from 'svelte';
    const { session } = stores();

    let to_name = '', to_email = '', to_address = '';
    let receipt_list = [];
    let itemName = '', itemPrice;
    let create, createModal;
    // don't chain anything like .toFixed() to end of line, it will break the reactive declaration :(
    // also, important to note that toFixed returns a string - do not do arithmetic with it!
    $: totalPrice = receipt_list.reduce((t, i) => t + i.price, 0.0);

    onMount(() => {
        M.AutoInit();
        createModal = M.Modal.getInstance(create);
        api.setToken($session.token);
    });

    function addItem()
    {
        let floatPrice = Number.parseFloat(itemPrice);
        if (itemName && isFinite(floatPrice) && floatPrice >= 0.01
            && floatPrice.toFixed(2) == floatPrice) {
            receipt_list = [...receipt_list, {
                name: itemName,
                price: floatPrice
            }];
            itemName = '';
            itemPrice = undefined;
        } else {
            M.toast({ html: 'Bad input' });
        }
    }

    function removeItem(i)
    {
        receipt_list.splice(i, 1);
        receipt_list = receipt_list;
    }

    function onCreatedOrder()
    {
        M.toast({ html: 'Invoice created successfully' });
        createModal.close();
    }

    function onCreateOrderFailed(err)
    {
        M.toast({ html: err });
    }
</script>

<style>
i.pointer {
    cursor: pointer;
}
</style>

<svelte:head>
    <title>Dashboard | SAGA</title>
</svelte:head>

<h1>Dashboard</h1>
<div class="row">
    <a class="waves-effect waves-light btn modal-trigger" href="#create">
        <i class="material-icons left">add</i>
        Create Invoice
    </a>
</div>
<div class="row">
    <a class="btn waves-effect waves-light" href="/receipts">View Receipts</a>
</div>

<!-- Begin modals -->
<div class="modal" id="create" bind:this={create}>
    <div class="modal-content">
        <h4>Create Invoice</h4>
        <div class="section">
            <div class="row">
                <div class="col s12">
                    <h6>Customer Info</h6>
                </div>
            </div>
            <form>
                <div class="row">
                    <div class="input-field col s12">
                        <input bind:value={to_name} type="text" id="to_name" name="to_name">
                        <label for="to_name">Name</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input bind:value={to_email} type="text" id="to_email" name="to_email">
                        <label for="to_email">Email</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input bind:value={to_address} type="text" maxlength="42" id="to_address" name="to_address">
                        <label for="to_address">SAGA Address</label>
                    </div>
                </div>
            </form>
        </div>
        <div class="section">
            <div class="row">
                <div class="col s12">
                    <h6>Receipt</h6>
                    <table class="highlight responsive-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Item Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each receipt_list as item, i}
                                <tr>
                                    <td>{item.name}</td>
                                    <td>{item.price} SAGA</td>
                                    <td><i class="material-icons pointer right" on:click={() => { removeItem(i) }}>delete</i></td>
                                </tr>
                            {/each}
                            {#if receipt_list.length}
                                <tr>
                                    <td>
                                        <strong>Total:</strong>
                                        {receipt_list.length > 1 ? `${receipt_list.length} items` : '1 item'},
                                        {totalPrice.toFixed(2)} SAGA
                                    </td>
                                </tr>
                            {/if}
                            <tr>
                                <td>
                                    <input type="text" bind:value={itemName} placeholder={`Item ${receipt_list.length + 1}`}>
                                </td>
                                <td>
                                    <input type="number" bind:value={itemPrice} min="0.01" step="0.01" placeholder="1.00">
                                </td>
                                <td>
                                    <button type="submit" class="right btn waves-effect waves-light" on:click={addItem}>
                                        <i class="material-icons left">add</i>
                                        Add Item
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button class="modal-close waves-effect btn-flat">Cancel</button>
        <AjaxButton
            method="post"
            action="/api/payments/create"
            name="createOrder"
            classes="waves-effect btn-flat"
            data={{ to_name, to_email, to_address,
                value: totalPrice.toFixed(2),
                receipt_list: JSON.stringify(receipt_list)
            }}
            resolve={onCreatedOrder}
            reject={onCreateOrderFailed}
        >
            Create
        </AjaxButton>
    </div>
</div>
