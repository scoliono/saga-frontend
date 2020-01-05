<script>
    import axios from 'axios';
    import * as api from '../api.js';
    import { onMount } from 'svelte';

    export let action;
    export let name;
    export let multiple = false;
    export let label;

    export let accept = '*/*';
    export let resolve, reject;

    let isDragging = false, isUploading = false;
    
    let progressPercent = 0;
    let formEl, inputEl;
    let fileLabel = 'No file selected';

    onMount(() => {
        formEl.reset();
    });

    function onChange(e) {
        if (inputEl.files.length === 1) {
            fileLabel = inputEl.files[0].name;
        } else if (inputEl.files.length > 1) {
            fileLabel = `${inputEl.files.length} files`;
        }
    }

    async function onSubmit(e) {
        if (isUploading) {
            return false;
        }
        isUploading = true;
        let formData = new FormData(formEl);
        try {
            const response = await api.upload(action, formData, p => {
                progressPercent = p.loaded / p.total;
            });
            if (response.success) {
                formEl.reset();
                if (typeof resolve === 'function') {
                    resolve(response);
                }
            } else {
                throw new Error('Response did not return success');
            }
        } catch (err) {
            if (typeof reject === 'function') {
                reject(err);
            }
        } finally {
            isUploading = false;
        }
    }
</script>

<form
    method="POST"
    action={`http://localhost:8000/${action}`}
    enctype="multipart/form-data"
    on:submit|preventDefault={onSubmit}
    bind:this={formEl}
>
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">{label}</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="file has-name">
                    <label class="file-label">
                        <input
                            class="file-input"
                            bind:this={inputEl}
                            id={`file-${name}`}
                            type="file"
                            name={multiple ? `${name}[]` : name}
                            {accept}
                            {multiple}
                            on:change={onChange}
                        >
                        <span class="file-cta">
                            <span class="file-icon">
                                <i class="fas fa-upload"></i>
                            </span>
                            <span class="file-label">
                                {`Select ${multiple ? 'files' : 'a file'}&hellip;`}
                            </span>
                        </span>
                        <span class="file-name">{fileLabel}</span>
                    </label>
                </div>
                <div class="control">
                    {#if inputEl.files.length > 0}
                        <button class="button" class:loading={isUploading} type="submit">Upload</button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</form>