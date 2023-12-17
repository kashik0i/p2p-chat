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
    <svelte:component this={component} {...props}/>
</div>

