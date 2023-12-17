<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {Button, Modal} from "@svelteuidev/core";
    import {onMount} from "svelte";
    import {MessageTypeEnum} from "@/enums/MessageTypeEnum";

    let video: HTMLVideoElement
    let canvas: HTMLCanvasElement
    let isCapturing = false
    let image = ''
    let file: File

    const dispatch = createEventDispatcher()
    onMount(async () => {
        video.srcObject = await navigator.mediaDevices.getUserMedia({
            video: true,
        })

        return () => {
            if ("getTracks" in video.srcObject) {
                //TODO dispose of tracks because this is not working
                video.srcObject.getTracks().forEach(track => track.stop())
            }
        }
    })

    function toggleCapture() {
        isCapturing = !isCapturing
        capture()
    }

    function capture() {
        const context = canvas.getContext('2d')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        image = canvas.toDataURL('image/png')
    }

    function handleSubmit(){
        canvas.toBlob((blob) => {
            file = new File([blob], 'image.png', {type: 'image/png'})
            dispatch('submit', {file:file,type:MessageTypeEnum.IMAGE})
        })
    }


</script>

<video bind:this={video} autoplay muted class:hidden={isCapturing}
       on:click={toggleCapture}></video>
<canvas bind:this={canvas} hidden></canvas>

{#if isCapturing}
    <div class="flex flex-col items-center justify-center">
        <img src={image} alt="image" on:click={toggleCapture}/>
        <Button class="mt-3" on:click={handleSubmit}>Upload</Button>
    </div>
{/if}
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

    .hidden {
        display: none;
    }


</style>