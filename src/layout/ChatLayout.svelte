<script lang="ts">
    import {
        colorScheme
    } from "@svelteuidev/core";
    import ChatNav from "@components/Chat/ChatNav.svelte";
    import Chat from "@components/Chat/Chat.svelte";
    import {applicationStore} from "@stores/applicationStore";

    let currentConversationId = $applicationStore.chatService.currentConversationId

    let opened = false;

    function toggleTheme() {
        colorScheme.update((v) => (v === 'light' ? 'dark' : 'light'));
    }

    function toggleAside() {
        opened = !opened;
    }
</script>

<div class="flex flex-col w-full h-full antialiased text-gray-800">
    <div class="flex flex-row h-full w-full overflow-x-hidden">
        <ChatNav/>
        <div class="flex flex-col flex-auto h-full p-4 w-full overflow-auto">
            <div class="flex flex-col flex-auto flex-shrink-0 rounded-2xl h-full p-4">
                <Chat currentConversationId={$currentConversationId} />
            </div>
        </div>
    </div>
</div>





