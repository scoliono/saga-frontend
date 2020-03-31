<script>
    import AjaxButton from '../components/AjaxButton.svelte';
    import CardModal from '../components/CardModal.svelte';
    import InputField from '../components/InputField.svelte';
    import * as api from '../api.js';
    import { onMount } from 'svelte';
    import { stores } from '@sapper/app';
    const { session } = stores();

    let from_id, from_name, from_email, to_address, memo;
    let receipt_list, discount_list;

    const defaultItem = { name: '', quantity: 1, rate: 1.0 };
    const defaultDiscount = { name: '', rate: -10.0 };
    let newItem, newDiscount;

    cleanData();

    $: subtotal = receipt_list.reduce((t, i) => t + i.rate * i.quantity, 0.0);
    $: multiplier = discount_list.reduce((t, i) => t + i.rate, 1.0);
    $: valueUnrounded = subtotal * multiplier;

    $: dirty = from_id || from_name || from_email || to_address || memo
        || receipt_list.length || discount_list.length || newItem.name
        || newDiscount.name;

    let errors = {};
    let createModal;

    function addItem()
    {
        const floatRate = Number.parseFloat(newItem.rate);
        const floatQuantity = Number.parseFloat(newItem.quantity);
        if (newItem.name && isFinite(floatRate) && floatRate >= 0.01
            && floatRate.toFixed(2) == floatRate
            && isFinite(floatQuantity) && floatQuantity > 0) {
            receipt_list = [...receipt_list, {
                name: newItem.name,
                rate: floatRate,
                quantity: floatQuantity
            }];
            newItem = defaultItem;
        } else {
            bulmaToast({ message: 'Bad input', type: 'is-danger' });
        }
    }

    function removeItem(i)
    {
        receipt_list.splice(i, 1);
        // svelte is weird sometimes
        receipt_list = receipt_list;
    }

    function addDiscount()
    {
        const floatRate = Number.parseFloat(newDiscount.rate);
        if (newDiscount.name && isFinite(floatRate) && floatRate.toFixed(2) == floatRate) {
            discount_list = [...discount_list, {
                name: newDiscount.name,
                rate: floatRate / 100
            }];
            newDiscount = defaultDiscount;
        } else {
            bulmaToast({ message: 'Bad input', type: 'is-danger' });
        }
    }

    function removeDiscount(i)
    {
        discount_list.splice(i, 1);
        discount_list = discount_list;
    }

    function cleanData()
    {
        from_name = '';
        from_email = '';
        to_address = '';
        memo = '';
        receipt_list = [];
        discount_list = [];
        newItem = {};
        newDiscount = {};
        Object.assign(newItem, defaultItem);
        Object.assign(newDiscount, defaultDiscount);
    }
</script>

<svelte:head>
    <title>Pay or Request | SAGA</title>
</svelte:head>

<div class="content">
    <h2>Pay or Request</h2>
    <button on:click={createModal.open} class="button is-info is-rounded">
        <span class="icon">
            <i class="fas fa-plus"></i>
        </span>
        <span>Create New Request</span>
    </button>
</div>

<!-- Begin modals -->
<CardModal bind:this={createModal} {dirty} on:closed={cleanData} title="Create New Request">
    <section class="modal-card-body">
        <form>
            <InputField
                name="from_name"
                label="Their Name"
                type="text"
                horizontal
                bind:value={from_name}
                bind:error={errors.from_name}
            />
            <InputField
                name="from_email"
                type="email"
                label="Their Email"
                horizontal
                bind:value={from_email}
                bind:error={errors.from_email}
            />
            <div class="field is-horizontal">
                <div class="field-label">
                    <label class="label">Your ETH Address</label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <div class="control">
                            <div class:is-danger={!!errors.to_address} class="select">
                                <select name="to_address" id="to_address" bind:value={to_address}>
                                {#if !$session.user.eth || !$session.user.eth.length}
                                    <option selected disabled>N/A</option>
                                {:else}
                                    <option selected disabled>Select an Address&hellip;</option>
                                    {#each $session.user.eth as eth}
                                        <option value={eth}>{eth}</option>
                                    {/each}
                                {/if}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="field is-horizontal">
                <p class="help is-danger">{errors.to_address || ''}</p>
            </div>
            <div class="field is-horizontal">
                <p class="is-size-7">Don't see any addresses here? Go to your <a href="/profile">profile</a> to add them.</p>
            </div>
            <InputField
                name="memo"
                type="text"
                label="Memo"
                horizontal
                required={false}
                bind:value={memo}
                placeholder="Optional"
                bind:error={errors.memo}
            />
            <hr>
            <h2 class="subtitle">Receipt</h2>
            <table class="table is-hoverable">
                <colgroup>
                    <col span="1" style="width: 40%;">
                    <col span="1" style="width: 30%;">
                    <col span="1" style="width: 10%;">
                    <col span="1" style="width: 20%;">
                </colgroup>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Rate</th>
                        <th>Quantity</th>
                        <th>Item Total</th>
                    </tr>
                </thead>
                <tbody>
                    {#each receipt_list as item, i}
                        <tr>
                            <td>{item.name}</td>
                            <td>{new Number(item.rate).toFixed(2)} SAGA</td>
                            <td>{item.quantity}</td>
                            <td>{new Number(item.rate * item.quantity).toFixed(3)} SAGA</td>
                            <td>
                                <button on:click|preventDefault={() => { removeItem(i); }} class="button">
                                    <span class="icon">
                                        <i class="fas fa-trash"></i>
                                    </span>
                                </button>
                            </td>
                        </tr>
                    {/each}
                    <tr>
                        <td>
                            <input class="input" type="text" bind:value={newItem.name}>
                        </td>
                        <td>
                            <input class="input" type="number" min="0.01" bind:value={newItem.rate}> SAGA
                        </td>
                        <td>
                            <input class="input" type="number" min="0" bind:value={newItem.quantity}>
                        </td>
                        <td>
                            <button class="button" on:click|preventDefault={addItem}>
                                <span class="icon">
                                    <i class="fas fa-plus"></i>
                                </span>
                                <span>Add Item</span>
                            </button>
                        </td>
                    </tr>
                    {#if receipt_list.length > 0}
                        <tr>
                            <td></td>
                            <td></td>
                            <td><strong>Subtotal</strong></td>
                            <td>{subtotal.toFixed(2)} SAGA</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
            <h2 class="subtitle">Discounts/Fees</h2>
            <table class="table is-hoverable">
                <colgroup>
                    <col span="1" style="width: 50%;">
                    <col span="1" style="width: 30%;">
                    <col span="1" style="width: 20%;">
                </colgroup>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Rate</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {#each discount_list as discount, i}
                        <tr class:has-text-danger={discount.rate > 0.0}>
                            <td>{discount.name}</td>
                            <td>{discount.rate * 100}%</td>
                            <td>
                                <button on:click|preventDefault={() => { removeDiscount(i) }} class="button">
                                    <span class="icon">
                                        <i class="fas fa-trash"></i>
                                    </span>
                                </button>
                            </td>
                        </tr>
                    {/each}
                    <tr>
                        <td><input class="input" type="text" bind:value={newDiscount.name}></td>
                        <td><input class="input" type="number" bind:value={newDiscount.rate}>%</td>
                        <td>
                            <button on:click|preventDefault={addDiscount} class="button">
                                <span class="icon">
                                    <i class="fas fa-plus"></i>
                                </span>
                                <span>Add Discount</span>
                            </button>
                        </td>
                    </tr>
                    {#if discount_list.length > 0}
                        <tr>
                            <td></td>
                            <td><strong>Net Discount</strong></td>
                            <td class:has-text-danger={multiplier > 1.0}>
                                {((multiplier - 1.0) * 100).toFixed(2)}%
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
            <h3 class="subtitle"><strong>TOTAL:</strong> {valueUnrounded.toFixed(2)} SAGA</h3>
        </form>
    </section>
    <footer class="modal-card-foot">
        <AjaxButton
            action="/api/order/create"
            method="post"
            classes="is-info"
            data={{
                from_name, from_email, to_address, memo,
                receipt_list: JSON.stringify(receipt_list),
                discount_list: JSON.stringify(discount_list),
                value: valueUnrounded.toFixed(2)
            }}
            resolve={() => {
                bulmaToast('Successfully requested payment');
                createModal.close(true);
            }}
            reject={err => {
                errors = err.response.data.errors;
                bulmaToast({
                    message: errors[0] || 'Failed to request payment',
                    type: 'is-danger'
                });
            }}
        >
            Create
        </AjaxButton>
        <button class="button" on:click|preventDefault={createModal.close}>Cancel</button>
    </footer>
</CardModal>
<!-- End modals -->
