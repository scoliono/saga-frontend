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
    let hasFile = false;
    
    let progressPercent = 0;
    let formEl, inputEl;
    let fileLabel = '';

    let canDragAndDrop = false;

    onMount(() => {
        let el = document.createElement('div');
        canDragAndDrop = 'FormData' in window && 'FileReader' in window &&
            ('draggable' in el) || ('ondragstart' in el && 'ondrop' in el);
        formEl.reset();
    });

    function beginDrag(e) {
        isDragging = true;
    }

    function endDrag(e) {
        isDragging = false;
    }

    function onDrop(e) {
        isDragging = false;
        hasFile = true;
        fileLabel = [...e.dataTransfer.files].map(f => f.name).join(', ');
    }

    function onChange(e) {
        hasFile = true;
    }

    async function onSubmit(e) {
        if (isUploading) {
            return false;
        }
        isUploading = true;
        if (canDragAndDrop) {
            e.preventDefault();
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
    }
</script>

<form
    class="upload-box"
    method="POST"
    action={`http://localhost:8000/${action}`}
    enctype="multipart/form-data"
    on:dragover={beginDrag}
    on:dragenter={beginDrag}
    on:dragleave={endDrag}
    on:dragend={endDrag}
    on:drop={onDrop}
    on:submit={onSubmit}
    bind:this={formEl}
>
    {#if !isUploading}
        <div class="file-field input-field upload-box-input">
            <div class="btn"
                style={`${isDragging ? 'background-color:#2bbbad;' : ''}`}
            >
                <span>
                    <i class="material-icons left">attach_file</i>
                    {label || `Select ${multiple ? 'files' : 'a file'}`}
                    {#if canDragAndDrop && !label}
                        {`or drag ${multiple ? 'them' : 'it'} here`}
                    {/if}
                    &hellip;
                </span>
                {#if multiple}
                    <input
                        bind:this={inputEl}
                        id={`file-${name}`}
                        type="file"
                        name={multiple ? `${name}[]` : name}
                        multiple="multiple"
                        {accept}
                        on:change={onChange}
                    >
                {:else}
                    <input
                        bind:this={inputEl}
                        id={`file-${name}`}
                        type="file"
                        name={multiple ? `${name}[]` : name}
                        {accept}
                        on:change={onChange}
                    >
                {/if}
            </div>
            {#if hasFile}
                <div class="file-path-wrapper">
                    <input class="file-path validate" type="text" bind:value={fileLabel}>
                </div>
                <button class="btn waves-effect waves-light upload-box-confirm" type="submit">Upload</button>
            {/if}
        </div>
    {:else}
        <div class="upload-box-progress">
            Uploading&hellip;
            <div class="progress">
                <div class="determinate" style={`width:${progressPercent}%;`}></div>
            </div>
        </div>
    {/if}
</form>