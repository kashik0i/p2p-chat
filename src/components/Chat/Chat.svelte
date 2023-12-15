<script lang="ts">
    import {onMount} from "svelte";
    import {applicationStore} from "@stores/applicationStore";
    import Message from "@components/Chat/Message/Message.svelte";
    import type {Writable} from "svelte/store";
    import AttachmentButton from "@components/Chat/AttachmentButton.svelte";
    import ChatInput from "@components/Chat/ChatInput.svelte";
    import SendButton from "@components/Chat/SendButton.svelte";

    let value = "";
    let messages:Message[] = [];
    let currentUser = $applicationStore.userService.user;
    onMount(() => {
        $applicationStore.chatService.messages.subscribe((value) => {
            messages = value;
        });
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

<div class="flex flex-col flex-auto h-full p-4 w-full">
    <div
            class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
    >
        <div class="flex flex-col h-full overflow-x-auto mb-4">
            <div class="flex flex-col h-full">
                <div class="grid grid-cols-12 gap-y-2">
                    {#each messages as message}
                        <div class="col-span-12">
                            <Message
                                    seen={true}
                                    isSelf={message.sender.id === $currentUser.id}
                                    message={message}
                            />
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
            <AttachmentButton/>
            <ChatInput on:keydown={handleEnter} bind:value/>
            <SendButton on:click={handleSend}/>
        </div>
    </div>
</div>