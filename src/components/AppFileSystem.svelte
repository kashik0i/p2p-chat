<script lang="ts">
    import {onMount} from "svelte";
    import {ActionIcon} from "@svelteuidev/core";
    import {applicationStore} from "@stores/applicationStore";
    import {derived,type Readable} from "svelte/store";

    type File = {
        messageId: string,
        conversationId: string,
        createdAt: string,
        sender: string,
        name: string,
        size: string,
        type: string,
        expired: boolean
    }
    const toMb = (size) => {
        return size / 1000 / 1000
    }
    export let files:Readable<File[]> = derived([$applicationStore.chatService.conversations,$applicationStore.users], ([conversations,users]) => {
        return conversations.reduce((acc, conversation) => {
            conversation.messages.forEach(message => {
                if (/*message.type === 'FILE'*/ message.metadata) {
                    const user = users.find(u => u.id === message.senderId)
                    console.log(message)
                    acc.push({
                        createdAt: new Date(message.timestamp).toLocaleString(),
                        conversationId: conversation.id,
                        messageId: message.id,
                        sender:user ? `${user.name.first} ${user.name.last}` : 'unknown',
                        name: message.metadata.name,
                        size: toMb(message.metadata.size).toFixed(2) + ' MB',
                        type: message.metadata.type,
                        // expired: URL.canParse(message.metadata.content)
                    })
                }
            })
            return acc
        }, [])
    })

    function handleRemoveFile(index) {
        console.log('Remove file', index)
        const messageId = $files[index].messageId
        const conversationId = $files[index].conversationId
        $applicationStore.chatService.removeMessage(conversationId,messageId)
    }
    $: conversations = $applicationStore.chatService.conversations;
    onMount(() => {
        // get files from chat messages

    });
</script>

<style>

</style>

<div class="max-w-md mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Files</h2>
    {#if $files.length > 0}
        {#each $files as file, index}
            {@const conversation = $conversations.find(c => c.id === file.conversationId)}
            <div class="flex items-center justify-between bg-white p-4 mb-2 rounded shadow-md">
                <div>
                    <p class="text-lg font-semibold">{file.name}</p>
                    <p class="text-gray-500">size: {file.size}</p>
                    <p class="text-gray-500">type: {file.type}</p>
                    <p class="text-gray-500">created at: {file.createdAt}</p>
                    <p class="text-gray-500">sender: {file.sender}</p>
                    <p class="text-gray-500">conversation: {conversation.name}</p>
<!--                    <p class="text-gray-500">expired: {file.expired ? 'yes' : 'no'}</p>-->
                </div>
                <ActionIcon variant="filled" color="red" size="md"
                            on:click={() => handleRemoveFile(index)}
                >
                    <span class="i-mdi-trash-can"></span>
                </ActionIcon>
            </div>
        {/each}
    {:else}
        <p>No files available.</p>
    {/if}
</div>
