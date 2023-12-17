<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {ActionIcon, Menu} from "@svelteuidev/core";
    import {applicationStore} from "@stores/applicationStore";
    import type {PeerCall} from "@/interfaces/PeerCall";
    import {onMount} from "svelte";
    import Slider from "@components/Controls/Slider.svelte";
    import type {User} from "@/interfaces/User";

    let call: PeerCall = {} as PeerCall;
    let opened = false;
    let onOpen = () => opened = true;
    let onClose = () => opened = false;
    let volume = 50;

    let users: Map<string, User> = new Map();
    let calleeId = '';
    onMount(() => {
        const callUnsubscribe = $applicationStore.callService.instance.subscribe((_call: PeerCall) => {
            call = _call
            calleeId = call.call?.peer || ''
        })
        const usersUnsubscribe = $applicationStore.peerService.peers.subscribe((_users: Map<string, User>) => {
            users = _users
        })

        return () => {
            callUnsubscribe()
            usersUnsubscribe()
        }
    })

</script>

<div class="flex flex-row ">
    <ActionIcon on:click={() => $applicationStore.callService.toggleCall(calleeId)}>
        {#if call.state === 'Idle'}
            <span class="i-lucide-phone"></span>
        {:else if call.state === 'Ringing'}
        {:else}
            <span class="i-lucide-phone-off bg-red-600" onclick={() => $applicationStore.callService.endCall()}
            ></span>
        {/if}
    </ActionIcon>
    <select bind:value={calleeId} class="bg-transparent border-none outline-none">
        <option value="">Select a user or group to call</option>
<!--        <option value={import.meta.env.VITE_GLOBAL_CHAT_ID}>Global Chat</option>-->
        {#each Array.from(users.values()) as user}
            <option value={user.id}>{user?.name?.first} {user?.name?.last}</option>
        {/each}
    </select>
    <ActionIcon on:click={() => $applicationStore.callService.toggleCamera()}>
        {#if !call.isCameraOff}
            <span class="i-lucide-video-off"></span>
        {:else}
            <span class="i-lucide-video"></span>
        {/if}
    </ActionIcon>

    <ActionIcon on:click={() => $applicationStore.callService.toggleMute()}>
        {#if !call.isMuted}
            <span class="i-lucide-mic-off"></span>
        {:else}
            <span class="i-lucide-mic"></span>
        {/if}
    </ActionIcon>
    <Menu {opened} on:open={onOpen} {onClose}>
        <ActionIcon slot="control">
                {#if volume === 0}
                    <span class="i-lucide-volume-x"></span>
                {:else if volume < 25}
                    <span class="i-lucide-volume"></span>
                {:else if volume < 50}
                    <span class="i-lucide-volume-1"></span>
                {:else if volume <= 100}
                    <span class="i-lucide-volume-2"></span>
                {/if}
        </ActionIcon>
        <Slider bind:value={volume} />
    </Menu>
    <ActionIcon>
        <span class="i-lucide-more-vertical"></span>
    </ActionIcon>
</div>