<script lang="ts">
    import SelfMessage from "@components/Chat/Message/SelfMessage.svelte";
    import OtherMessage from "@components/Chat/Message/OtherMessage.svelte";
    import Avatar from "@components/Avatar.svelte";
    import type {Message} from "@/interfaces/Message";
    import type {User} from "@/interfaces/User";
    import {applicationStore} from "@stores/applicationStore";
    import {onMount} from "svelte";
    import {Menu} from "@svelteuidev/core";
    import ContextMenu from "@components/ContextMenu.svelte";
    import {MessageTypeEnum} from "@/enums/MessageTypeEnum";

    export let isSelf = false;
    export let message: Message;
    export let seen = false;

    let props: any = {
        seen: false,
        avatar: undefined,
        message: message,
    };
    let component: typeof SelfMessage | typeof OtherMessage;
    let sender: User | undefined = undefined;
    let avatar: string | undefined = undefined;
    onMount(() => {
        if (isSelf) {
            props.seen = seen;
        }
        component = isSelf ? SelfMessage : OtherMessage;
        sender = $applicationStore.getUserById(message.senderId);
        props.avatar = sender?.avatar;
        props.message = message;
    });
</script>
<div>
    {#if component === SelfMessage}
        <SelfMessage {...props}>
            <div class="flex flex-row items-center" slot="message">
                {#if message.type === MessageTypeEnum.TEXT}
                    {message.content}
                {:else if message.type === MessageTypeEnum.AUDIO}
                    <audio src={message.content} controls></audio>
                {:else if message.type === MessageTypeEnum.IMAGE}
                    <img src={message.content} alt={message.metadata.name}/>
                {:else if message.type === MessageTypeEnum.FILE}
                    <a href={message.content} download={message?.metadata?.name}>{message?.metadata?.name}</a>
                {:else if message.type === MessageTypeEnum.VIDEO}
                    <video src={message.content} controls></video>
                {/if}
            </div>
        </SelfMessage>
    {:else}
        <OtherMessage {...props}>
            <div class="flex flex-row items-center" slot="message">
                {#if message.type === MessageTypeEnum.TEXT}
                    {message.content}
                {:else if message.type === MessageTypeEnum.AUDIO}
                    <audio src={message.content} controls></audio>
                {:else if message.type === MessageTypeEnum.IMAGE}
                    <img src={message.content} alt={message.metadata.name}/>
                {:else if message.type === MessageTypeEnum.FILE}
                    <a href={message.content} download={message?.metadata?.name}>{message?.metadata?.name}</a>
                {:else if message.type === MessageTypeEnum.VIDEO}
                    <video src={message.content} controls></video>
                {/if}
            </div>
        </OtherMessage>
    {/if}
</div>

<style>
    audio, video {
        max-width: 100%;
        max-height: 200px;
    }
</style>