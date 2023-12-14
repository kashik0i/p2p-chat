<script lang="ts">
    import MessageCard from "./MessageCard.svelte";
    import {onMount} from "svelte";

    export let chats = []



</script>

{#each chats as chat}
    <MessageCard {chat}/>
{/each}

<style>

</style>