<script>
    import * as api from '../api.js';
    import { createEventDispatcher } from 'svelte';

    export let action, method;
    export let data = {};
    export let resolve, reject;
    export let name;
    export let classes;

    const dispatch = createEventDispatcher();

    async function onClick(e) {
        dispatch('click', e);
        try {
            let response;
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
        }
    }
</script>

<style>
</style>

<div class={classes} on:click={onClick}>
    <slot></slot>
</div>