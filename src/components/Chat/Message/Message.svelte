<script lang="ts">
    import SelfMessage from "@components/Chat/Message/SelfMessage.svelte";
    import OtherMessage from "@components/Chat/Message/OtherMessage.svelte";
    import Avatar from "@components/Avatar.svelte";
    import type {Message} from "@/interfaces/Message";
    import type {User} from "@/interfaces/User";
    import {applicationStore} from "@stores/applicationStore";

    export let isSelf = false;
    export let message:Message;
    export let seen = false;

    let props = isSelf ? {seen} : {};

    $: component = isSelf ? SelfMessage : OtherMessage;

    // const sender:User = $applicationStore.chatService.getUserByPeerId(message.sender);
</script>
<svelte:component this={component} {...props}>
    <Avatar src={message.sender.avatar} radius="xl" slot="avatar"/>
    <div slot="message">
        {message.content}
    </div>
</svelte:component>
