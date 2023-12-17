<script lang="ts">
    import {onMount} from "svelte";
    import {Dish} from "./Dish";
    import {ActionIcon} from "@svelteuidev/core";
    import { Plus,Minus,Play } from 'radix-icons-svelte';
    import {type Writable, writable} from "svelte/store";
    import VideoContainer from "@components/CallManager/VideoContainer.svelte";
    import demoVideo from "@assets/demo.mp4";
    let manager: HTMLDivElement;
    let count: number = 0;
    let containers: Writable<ContainerInfo[]> = writable([]);

    type ContainerInfo = {
        name: string,
        // width: 0,
        // height: 0,
        // count: 0,
        // rows: 0,
        // cols: 0,
        // gap: 0,
        // margin: 0,
        src?: string,
        muted?: boolean,
        video?: HTMLVideoElement | null,
    };

    onMount(() => {
        // const videoSrc =
        const {width, height} = manager.getBoundingClientRect();
        handleResize();
        window.addEventListener('resize', handleResize);
    });

    function handleResize() {

    }

    function handleAdd() {
        const container:ContainerInfo = {
            name: `container-${count}`,
            src: demoVideo,
            video: null,
        }
        containers.update((value) => {
            value.push(container);
            return value;
        });
        count++;
    }

    function handleDelete() {
        if (count === 0) return;
        containers.update((value) => {
            value.pop();
            return value;
        });
        count--;
    }

    function handlePlayDemo() {
        containers.update((value) => {
            value.forEach((container) => {
                container.video?.play();
            });
            return value;
        });
    }

</script>
<div class="video-call">
    <div>{count}</div>
    <div class="video-call-manager" bind:this={manager}>
        <slot/>
    </div>
<!--    <div class="video-call-manager" bind:this={manager}>-->
<!--        {#each $containers as container}-->
<!--            <svelte:component this={VideoContainer} props={container}/>-->
<!--        {/each}-->
<!--    </div>-->
    <div class="controls">
        <ActionIcon on:click={handleAdd}>
            <Plus/>
        </ActionIcon>
        <ActionIcon  on:click={handleDelete}>
            <Minus/>
        </ActionIcon>
        <ActionIcon on:click={handlePlayDemo}>
            <Play/>
        </ActionIcon>
    </div>
</div>



<style>
    .video-call {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }
    .video-call-manager {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        grid-gap: 10px;
        grid-auto-flow: row;
        overflow-y: scroll;
        padding: 10px;
    }

    .controls {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
