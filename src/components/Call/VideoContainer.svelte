<script lang="ts">
    import {onMount} from "svelte";
    import type {MediaStreamInfo} from "@/interfaces/MediaStreamInfo";

    export let name: 'container'
    export let stream: MediaStream | null = null
    export let muted = true
    export let video: HTMLVideoElement
    onMount(() => {
        if (stream) {
            video.srcObject = stream
        }
    })


</script>
    <video bind:this={video} bind:muted autoplay></video>

<style>
    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

</style>

