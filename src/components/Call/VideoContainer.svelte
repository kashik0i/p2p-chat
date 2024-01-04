<script lang="ts">
    import {onMount} from "svelte";
    import type {MediaStreamInfo} from "@/interfaces/MediaStreamInfo";
    import {randomGradiant} from "@/utils";

    export let name: 'container'
    export let stream: MediaStream;
    export let muted = true
    let video: HTMLVideoElement

    $: if (stream && video) {
        video.srcObject = stream
    }

    $: isCameraOn = stream && stream.getVideoTracks().length > 0
    export let volume = 100;
    $: if (video) {
        video.volume = volume / 100
    }
    onMount(() => {
        video.style.background = randomGradiant()
    })
</script>
<video bind:this={video} bind:muted autoplay></video>
<!--{isCameraOn}-->
<!--{#if isCameraOn}-->
<!--{:else }-->
<!--    <div class="flex items-center justify-center h-full">-->
<!--        <div class="text-4xl text-gray-400">-->
<!--            <i class="fas fa-video-slash"></i>-->
<!--        </div>-->
<!--    </div>-->
<!--{/if}-->

<style>
    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

</style>

