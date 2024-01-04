<script>
    import {Menu} from "@svelteuidev/core";
    import {ActionIcon} from "@svelteuidev/core";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    function handleFile() {
        dispatch('upload', {type: 'file'})
    }

    function handleImage() {
        dispatch('upload', {type: 'image'})
    }

    function handleMap() {
        dispatch('upload', {type: 'map'})
    }

    function handleCamera() {
        dispatch('upload', {type: 'camera'})
    }

</script>
<div>
    <Menu class="" trigger="click">
        <ActionIcon slot="control" class="w-2">
            <span class="i-lucide-paperclip"/>
        </ActionIcon>
        <div class="flex flex-row space-x-2 p-2">
            <ActionIcon on:click={handleImage}>
                <span class="i-lucide-image"/>
            </ActionIcon>
            <ActionIcon on:click={handleMap}>
                <span class="i-lucide-map"/>
            </ActionIcon>
            <ActionIcon on:click={handleCamera}>
                <span class="i-lucide-camera"/>
            </ActionIcon>
            <ActionIcon on:click={handleFile}>
                <span class="i-lucide-file"/>
            </ActionIcon>
        </div>

    </Menu>
</div>