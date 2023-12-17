<script lang="ts">
    import {afterUpdate, onMount} from "svelte";
    import {Dish} from "./Dish";
    import {ActionIcon} from "@svelteuidev/core";
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
        window.addEventListener('resize', handleResize);
    });

    $:  {
        count = manager?.childElementCount ?? 0;
        handleResize();
    }

    function handleResize() {
        if(!manager) return;
        const {width, height} = manager.getBoundingClientRect();
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        const gap = 10;
        const margin = 10;
        const containerWidth = (width - (cols - 1) * gap - 2 * margin) / cols;
        const containerHeight = (height - (rows - 1) * gap - 2 * margin) / rows;
        manager.style.gridTemplateColumns = `repeat(${cols}, ${containerWidth}px)`;
        manager.style.gridTemplateRows = `repeat(${rows}, ${containerHeight}px)`;
        manager.style.gridGap = `${gap}px`;
        manager.style.margin = `${margin}px`;
    }


</script>
<div class="video-call">
    <div>{count}</div>
    <div class="video-call-manager" bind:this={manager}>
        <slot/>
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

    .video-call-manager > * {
        width: 100%;
        height: 100%;
    }

    .video-call-manager > *:nth-child(1) {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
    }

</style>
