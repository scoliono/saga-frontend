<script>
	import { onMount, createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    export let title;
    export let dirty = false;

    let visible = false;

    onMount(() => {
        window.onbeforeunload = e => {
            if (dirty) {
                e.preventDefault();
            }
        };
    });

    export function close(force)
    {
        if (dirty && force !== true) {
            if (!confirm('You will lose whatever data you have ' +
                         'entered if you proceed. Continue?')) {
                return;
            }
        }
        visible = false;
        dispatch('closed');
    }

    export function open()
    {
        visible = true;
        dispatch('opened');
    }
</script>

<div class="modal" class:is-active={visible}>
    <div class="modal-background" on:click={close}></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <span class="modal-card-title">{title}</span>
            <button class="delete" aria-label="close" on:click={close}></button>
        </header>
        <slot></slot>
    </div>
</div>
