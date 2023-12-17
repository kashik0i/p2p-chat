<script>
    import {Menu} from "@svelteuidev/core";
    import {ActionIcon} from "@svelteuidev/core";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    function handleFile(){
        dispatch('upload',{type:'file'})
    }

    function handleImage(){
        dispatch('upload',{type:'image'})
    }

    function handleMap(){
        dispatch('upload',{type:'map'})
    }

    function handleCamera(){
        dispatch('upload',{type:'camera'})
    }

</script>

<div>
    <Menu>
        <ActionIcon slot="control">
            <span class="i-lucide-paperclip"/>
        </ActionIcon>
        <Menu.Item>
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
        </Menu.Item>
    </Menu>
</div>