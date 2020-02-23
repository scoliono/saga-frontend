<script>
    export let title;

    let visible = false;

    export function close()
    {
        visible = false;
    }

    export function open()
    {
        visible = true;
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
