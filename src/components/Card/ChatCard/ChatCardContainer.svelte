<script lang="ts">

    import Card from "./ChatCard.svelte";
    import {onMount} from "svelte";

    export let cards: any[] = [];
    let container: HTMLDivElement;
    onMount(() => {
        const removePointerScroll = pointerScroll(container);
        return () => removePointerScroll();
    });


    const pointerScroll = (elem) => {

        let isDrag = false;

        const dragStart = () => isDrag = true;
        const dragEnd = () => isDrag = false;
        const drag = (ev) => {
            ev.preventDefault();
            isDrag && (elem.scrollLeft -= ev.movementX);
        };

        elem.addEventListener("pointerdown", dragStart);
        addEventListener("pointerup", dragEnd);
        addEventListener("pointermove", drag);

        return () => {
            elem.removeEventListener("pointerdown", dragStart);
            removeEventListener("pointerup", dragEnd);
            removeEventListener("pointermove", drag);
        }
    };

</script>


<div class="card-container " bind:this={container}>
    {#each cards as card}
        <Card bind:title={card.title} bind:avatar={card.avatar}/>
    {/each}
</div>


<style>
    .card-container {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        padding: 10px;
        overflow: scroll;
        -ms-overflow-style: none;  /* IE and Edge */
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: -ms-autohiding-scrollbar;
    }

    .card-container::-webkit-scrollbar {
        display: none;
    }

    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
    }

</style>