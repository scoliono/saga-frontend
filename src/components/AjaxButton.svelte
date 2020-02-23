<script>
    import * as api from '../api.js';
    import { createEventDispatcher } from 'svelte';

    export let action, method;
    export let data = {};
    export let submit = false;
    export let resolve, reject;
    export let classes = '';

    let disabled = false;

    const dispatch = createEventDispatcher();

    async function onClick(e) {
        dispatch('click', e);
        if (e.target.closest('form') &&
            !e.target.closest('form').checkValidity()) {
            return false;
        } else {
            e.preventDefault();
        }
        try {
            let response;
            disabled = true;
            if (method.toLowerCase() === 'post') {
                response = await api.post(action, data);
            } else if (method.toLowerCase() === 'get') {
                response = await api.get(action, data);
            } else {
                throw new Error(`Unrecognized HTTP method "${method.toLowerCase()}"`);
            }
            if (response.success) {
                if (typeof resolve === 'function') {
                    resolve(response);
                }
            } else if (response.message) {
                throw new Error(response.message);
            } else if (response.errors) {
                throw new Error(response.errors);
            } else if (response.error) {
                throw new Error(response.error);
            } else {
                throw new Error(`Response did not return success: ${JSON.stringify(response)}`);
            }
        } catch (err) {
            if (typeof reject === 'function') {
                reject(err);
            }
        } finally {
            disabled = false;
        }
    }
</script>

<style>
</style>

<button class={`button ${classes}`}
    class:is-loading={disabled}
    {disabled}
    type={submit ? 'submit' : 'button'}
    on:click={onClick}
>
    <slot></slot>
</button>
