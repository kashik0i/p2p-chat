<script lang="ts">
    import {onMount} from "svelte";
    import {applicationStore} from "@stores/applicationStore";

    let value = "";

    $: messages = $applicationStore.chatService.messages;
    onMount(() => {

    });

    function handleSend() {
        $applicationStore.send(value);
        value = "";
    }

    function handleEnter(event) {
        if (event.key === "Enter") {
            handleSend();
        }
    }
</script>

<div>
    <h1>Chat</h1>
    <div>
        {JSON.stringify($messages, null, 2)}
        <!--{#each $applicationStore.chatService.messages as message}-->
        <!--    <div>{JSON.stringify(message)}</div>-->
        <!--{/each}-->
    </div>
</div>

<div class="flex w-full h-full justify-center items-center">
    <input
            class=" rounded-sm border border-solid px-3 leading-none text-black"
            id="text"
            bind:value
            on:keydown={handleEnter}
    />
    <button on:click={handleSend}>Send</button>
</div>


