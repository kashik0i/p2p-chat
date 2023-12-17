<script lang="ts">

    import Avatar from "@components/Avatar.svelte";
    import {Badge, Burger, Button, MediaQuery, Text, Tabs, ActionIcon, Menu} from "@svelteuidev/core";
    import {applicationStore} from "@stores/applicationStore";
    import {generateAvatar} from "@utils/avatar";
    import {onMount} from "svelte";
    import type {Chat} from "@/interfaces/Chat";
    import type {Writable} from "svelte/store";
    import {writable} from "svelte/store";

    const call = $applicationStore.callService.call;
    let conversations = writable(new Map<string, Chat>());
    let currentConversationId: Writable<string | null> = writable();
    let currentUser = $applicationStore.userService.user;

    onMount(() => {
        conversations = $applicationStore.chatService.conversations;
        currentConversationId = $applicationStore.chatService.currentConversationId;

    })
    let selectConversation = (e) => {
        let index = e.currentTarget.getAttribute('data-index');
        $applicationStore.chatService.selectConversation(index);
    }
</script>


<MediaQuery query="(min-width: 600px)" styles={{ bc: '$blue50', d:"none" }}>
    <div class="flex flex-col py-8  pr-2  bg-white h-full w-full max-w-fit ">
        <div class="flex flex-row items-center h-12 w-full">
            <div
                    class="flex items-center w-10 rounded-full bg-indigo-500 flex-shrink-0 ml-4"
            >
                <Avatar src={$currentUser.avatar} radius="md"/>
            </div>
        </div>
        <div class="flex flex-col mt-8 h-full">
            <div class="flex flex-col space-y-1 mt-4 -mx-2 h-64 overflow-auto scrollbar scrollbar-w-1 scrollbar-thumb-rounded  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {#each $conversations.values() as {avatar, name, unread}}
                    <div class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 cursor-pointer">
                        <div>
                            {#if avatar}
                                <div class="w-8 bg-indigo-200 rounded-full">
                                    <Avatar src={avatar} radius="md"/>
                                </div>
                            {:else}
                                <div class=" text-sm font-semibold">{name}</div>
                            {/if}
                            {#if unread}
                                <Badge color="red" size="sm" class="ml-2 w-7">{unread}</Badge>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</MediaQuery>
<!-- Small screen -->
<MediaQuery query="(max-width: 600px)" styles={{ bc: '$blue50', d:"none" }}>
    <div class="flex flex-col py-8  pr-2  bg-white h-full w-full max-w-fit ">
        <div class="flex flex-row items-center justify-center h-12 w-full">
            <div
                    class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
            >
                <Avatar radius="md" src={$currentUser.avatar}/>
            </div>
        </div>
        <div class="flex flex-col mt-8 h-full">
            <div class="flex flex-row items-center justify-between text-xs">
                <span class="font-bold">Conversations</span>
<!--                <Badge color="red" size="sm">{totalUnread}</Badge>-->
            </div>
            <div class="flex flex-col space-y-1 mt-4 -mx-2  overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-gray-100 ">
                {#each $conversations.values() as {avatar, name, id,unread}}
                    <div class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 cursor-pointer"
                         on:click={selectConversation} data-index={id}>
                        {#if avatar}
                            <div class="flex items-center justify-center w-8 bg-indigo-200 rounded-full">
                                <Avatar src={avatar} radius="md"/>
                            </div>
                        {/if}
                        <div class="flex items-center">
                            <div class=" text-sm font-semibold">{name}</div>
                            {#if unread}
                            <Badge color="red" size="sm" class="ml-2 w-7">{unread}</Badge>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</MediaQuery>

