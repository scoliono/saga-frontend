<script>
    import { onMount } from 'svelte';

    export let name;
    export let label;
    export let placeholder = '';
    export let required = true;
    export let type = 'text';
    export let value;
    export let min = undefined, max = undefined;
    export let disabled = false;
    // what's a better way to do this?
    export let error = '';
    export let horizontal = false;

    // one way binding, also clear old error msg
    const onInput = e => {
        value = e.target.value;
        if (error) {
            error = undefined;
        }
    };
</script>

{#if horizontal}
    <div class="field is-horizontal">
        <div class="field-label">
            <label class="label">{label}</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <input class="input"
                        class:is-danger={!!error}
                        {placeholder}
                        {required}
                        id={name}
                        {name}
                        {value}
                        {type}
                        {min}
                        {max}
                        {disabled}
                        on:input={onInput}>
                </div>
            </div>
        </div>
    </div>
    <div class="field is-horizontal">
        <p class="help is-danger">{error || ''}</p>
    </div>
{:else}
    <div class="field">
        <label class="label">{label}</label>
        <div class="control">
            <input class="input"
                class:is-danger={!!error} 
                {placeholder}
                {required}
                id={name}
                {name}
                {value}
                {type}
                {min}
                {max}
                {disabled}
                on:input={onInput}>
        </div>
        <p class="help is-danger">{error || ''}</p>
    </div>
{/if}
