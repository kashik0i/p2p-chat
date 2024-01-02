<script lang="ts">
    import Controls from "@components/Call/Controls.svelte";
    import type {PeerCall} from "@/interfaces/CallService";
    import CallGrid from "@components/Call/CallGrid/CallGrid.svelte";
    import Chat from "@components/Chat/Chat.svelte";
    import {applicationStore} from "@stores/applicationStore";
    import {ActionIcon, Button, Collapse} from "@svelteuidev/core";
    import {watchResize} from "svelte-watch-resize";

    let currentCall = $applicationStore.callService.currentCall
    let currentSideMenu = "chat"
    let open = false
    const handleToggleCurrentSideMenu = (state) => {
        if (currentSideMenu === state) {
            open = !open
            return
        }
        currentSideMenu = state
        open = true
    }
    const handleResize = ({offsetWidth, offsetHeight}: HTMLHtmlElement) => {
        console.log(offsetWidth, offsetHeight)
        //wait 5ms for the dom to update
        setTimeout(() => {
            $applicationStore.callService.layout?.layout()
        }, 50)
    }
</script>
<div class="flex flex-col flex-auto ">
    <div class="flex flex-grow w-full h-full overflow-clip">
        <div class="flex flex-auto w-full h-full">
            <CallGrid/>
        </div>
        <div use:watchResize={handleResize} class="flex flex-row h-full pb-2">
            <div class:hidden={!open} class="h-full">
                {#if currentSideMenu === "chat"}
                    <Chat currentConversationId={$currentCall?.metadata.conversationId}/>
                {:else}
                    <div>phonebook</div>
                {/if}
            </div>
            <div class="flex flex-col h-full">
                <ActionIcon on:click={()=>handleToggleCurrentSideMenu("chat")} variant="filled" class="mb-2">
                    <span class="i-mdi-chat">chat</span>
                </ActionIcon>
                <ActionIcon on:click={()=>handleToggleCurrentSideMenu("phonebook")} variant="filled">
                    <span class="i-mdi-book">chat</span>
                </ActionIcon>
            </div>
        </div>
    </div>
    <Controls/>
</div>

<!--<CallModal bind:callRequest={currentCall}/>-->

<style>
    .hidden {
        display: none;
    }

    .slide-enter-active, .slide-leave-active {
        transition: all 0.3s ease;
    }


</style>




