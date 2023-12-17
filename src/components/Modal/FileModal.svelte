<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {Button, FileUpload, Modal} from "@svelteuidev/core";
    import {onMount} from "svelte";
    import {MessageTypeEnum} from "@/enums/MessageTypeEnum";

    let file: File|null = null

    const dispatch = createEventDispatcher()
    onMount(async () => {

    })

    function handleSelected(e) {
        file = e.detail[0].file
        console.log(file)
    }


    function handleSubmit(e){
        if(!file){
            alert('Please select a file')
            return
        }
        const fileType = file.type?.split('/')[0]
        let messageType: MessageTypeEnum;
        switch (fileType) {
            case 'image':
                messageType=MessageTypeEnum.IMAGE
                break;
            case 'video':
                messageType=MessageTypeEnum.VIDEO
                break;
            case 'audio':
                messageType=MessageTypeEnum.AUDIO
                break;
            default:
                messageType=MessageTypeEnum.FILE
                break;
        }
        dispatch('submit', {file:file,type:messageType})
    }

    let fileUpload
    function handleRemove(){
        fileUpload.files = []
        file = null
    }
</script>

<div class="">
    <FileUpload multiple={false} on:selected={handleSelected} on:remove={handleRemove} bind:this={fileUpload}>
        <span class="i-lucide-trash" slot="removeIcon"></span>
        <span class="i-lucide-file" slot="fileIcon"></span>
    </FileUpload>
    <div class="flex flex-col items-center justify-center">
        <Button disabled={file===null} class="mt-3" on:click={handleSubmit}>Send</Button>
    </div>

</div>


<style>
    /*on hover show image capture*/

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    video:hover {
        cursor: pointer;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    img:hover {
        cursor: pointer;
    }




</style>