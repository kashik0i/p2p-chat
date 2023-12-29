<script lang="ts">
    import {
        colorScheme
    } from "@svelteuidev/core";
    import ChatNav from "@components/Chat/ChatNav.svelte";
    import Chat from "@components/Chat/Chat.svelte";


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
        <Chat/>
    </div>
</div>





