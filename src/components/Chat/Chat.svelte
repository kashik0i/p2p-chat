<script lang="ts">
    import {onMount} from "svelte";
    import {applicationStore} from "@stores/applicationStore";
    import Message from "@components/Chat/Message/Message.svelte";
    import AttachmentButton from "@components/Chat/AttachmentButton.svelte";
    import ChatInput from "@components/Chat/ChatInput.svelte";
    import SendButton from "@components/Chat/SendButton.svelte";
    import type {Chat} from "@/interfaces/Chat";
    import {Modal} from "@svelteuidev/core";
    import CameraModal from "@components/Modal/CameraModal.svelte";
    import FileModal from "@components/Modal/FileModal.svelte";

    let value = "";
    let currentUser = $applicationStore.userService.user;
    let conversations = $applicationStore.chatService.conversations;
    let currentConversationId = $applicationStore.chatService.currentConversationId;
    $: currentConversation = $conversations.find((c) => c.id === $currentConversationId);


    let openCameraModal = false;
    let openFileModal = false;

    onMount(() => {

        return () => {
        }
    });

    function handleSend() {
        if (!currentConversationId) {
            alert("Select a conversation first");
            return;
        }
        $applicationStore.send(value, $currentConversationId);
        value = "";
    }

    function handleEnter(event) {
        if (event.key === "Enter") {
            handleSend();
        }
    }

    function handleOpenModal(e){
        const type = e.detail.type
        console.log(type)
        switch (type) {
            case "camera":
                openCameraModal = true;
                break;
            case "file":
                openFileModal = true;
                break;
        }

    }
    function handleCameraUpload(e){
        if (!currentConversationId) {
            alert("Select a conversation first");
            return;
        }
        openCameraModal = false;
        $applicationStore.sendFile(e.detail.file,e.detail.type, $currentConversationId);
    }

    function handleUpload(e){
        if (!currentConversationId) {
            alert("Select a conversation first");
            return;
        }
        openFileModal = false;
        $applicationStore.sendFile(e.detail.file,e.detail.type,$currentConversationId);
    }





</script>
<div class="flex flex-col flex-auto h-full p-4 w-full">
    <div class="flex flex-col flex-auto flex-shrink-0 rounded-2xl  h-full p-4">
        <div class="flex flex-col h-full overflow-x-auto mb-4">
            <div class="flex flex-col h-full">
                <div class="grid grid-cols-12 gap-y-2">
                    {#if $currentConversationId === null}
                        <div class="col-span-12">
                            <div class="flex flex-col justify-center items-center h-full">
                                <div class=" text-xl font-medium">
                                    Select a conversation
                                </div>
                            </div>
                        </div>
                    {:else}
                        {#each currentConversation?.messages as message}
                            <div class="col-span-12">
                                <Message
                                        seen={true}
                                        isSelf={message.senderId === $currentUser.id.toString()}
                                        message={message}
                                />
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
        <div class="flex flex-row items-center h-16 rounded-xl w-full px-4">
            <AttachmentButton on:upload={handleOpenModal}/>
            <ChatInput on:keydown={handleEnter} bind:value/>
            <SendButton on:click={handleSend}/>
        </div>
    </div>
</div>
<Modal bind:opened={openCameraModal} withCloseButton={true} closeOnClickOutside  title="Capture Image" on:close={() => openCameraModal = false}>
    <CameraModal  on:submit={handleCameraUpload}/>
</Modal>
<Modal bind:opened={openFileModal} withCloseButton={true} closeOnClickOutside title="Upload File" on:close={() => openFileModal = false}>
    <FileModal on:submit={handleUpload}/>
</Modal>
