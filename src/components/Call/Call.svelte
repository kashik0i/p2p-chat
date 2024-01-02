<script lang="ts">
    import Controls from "@components/Call/Controls.svelte";
    import type {PeerCall} from "@/interfaces/CallService";
    import CallGrid from "@components/Call/CallGrid/CallGrid.svelte";
    import Chat from "@components/Chat/Chat.svelte";
    import {applicationStore} from "@stores/applicationStore";

    let currentCall = $applicationStore.callService.currentCall

</script>
<div class="flex flex-col flex-auto ">
    <div class="flex flex-grow w-full h-full overflow-clip ">
        <!--        <div>phonebook</div>-->
        <div class="flex flex-auto h-full">
            <CallGrid/>
            <div class="flex flex-col h-full  w-full ">
                <div class="flex flex-col flex-auto  h-full p-4">
                    <Chat currentConversationId={$currentCall?.metadata.conversationId}/>
                </div>
            </div>
        </div>
    </div>
    <Controls/>
</div>

<!--<CallModal bind:callRequest={currentCall}/>-->

<style>
    .test {
        background-color: #1f1f1f;
    }
</style>




