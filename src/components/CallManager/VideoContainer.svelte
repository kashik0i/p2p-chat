<script lang="ts">
    import {onMount} from "svelte";

    export let name: 'container'
    export let stream: MediaStream | null = null
    export let muted = true
    export let video: HTMLVideoElement

    onMount(() => {
        if (stream) {
            video.srcObject = stream
            video.muted = muted
        }
    })

</script>

<div class="container">
    <h1>{name}</h1>
    <video bind:this={video} autoplay></video>
</div>


<style>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>

