<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {ActionIcon, Menu} from "@svelteuidev/core";
    import {applicationStore} from "@stores/applicationStore";
    import {onMount} from "svelte";
    import Slider from "@components/Controls/Slider.svelte";
    import type {PeerCall} from "@/interfaces/CallService";
    import {derived, get, type Readable, type Writable} from 'svelte/store';
    import type {User} from "@/interfaces/User";
    import Avatar from "@components/Avatar.svelte";
    import type {Chat} from "@/interfaces/Chat";
    import type {CallParticipant} from "@/interfaces/CallService/CallParticipant";

    let call: PeerCall | null = null;

    export let isCameraOff = false;
    export let isScreenSharing = false;
    export let isMuted = false;
    export let calleeId = '';
    type Contact = {
        id: string;
        name: string;
        avatar: string;
        online: boolean;
    }
    let contacts: Readable<Contact[]> = derived(
        [$applicationStore.users, $applicationStore.userService.user],
        ([users, currentUser], set) => set(users.filter(user => user.id !== currentUser.id).map((user: User) => ({
            id: user.id,
            name: `${user.name.first ?? ''} ${user.name.last ?? ''}`,
            avatar: user.avatar,
            online: user.online
        }))),
    );
    let groups: Readable<Contact[]> = derived(
        $applicationStore.chatService.conversations,
        (conversations, set) => set(conversations.map((conversation: Chat) => ({
            id: conversation.id,
            name: conversation.name,
            avatar: conversation.avatar,
        }))),
    );

    const dispatch = createEventDispatcher();
    let currentUser = $applicationStore.userService.user;
    let currentParticipant: Readable<CallParticipant | null> = derived(
        [$applicationStore.callService.currentCall, $applicationStore.userService.user],
        ([call, user], set) => {
            if (call === null) {
                set(null)
                return
            }
            set(get(call.participants).find(participant => participant.id === user.id) ?? null)
        }
    )
    let volume = $applicationStore.callService.volume;
    onMount(() => {
        const callUnsubscribe = $applicationStore.callService.currentCall.subscribe((_call) => {
            call = _call
            // isCameraOff = _call?.participants?.isCameraOff ?? false;
        })

        return () => {
            callUnsubscribe()
        }
    })
    let opened = false;
    let onOpen = () => {
        opened = true;
    }
    let onClose = () => {
        opened = false;
    }
    const handleToggleCamera = () => {
        $applicationStore.toggleCamera($currentUser)
        isCameraOff = !isCameraOff;
    }
    const handleToggleScreenShare = () => {
        $applicationStore.toggleScreenShare($currentUser)
        isScreenSharing = !isScreenSharing;
    }
    const handleToggleVoice = () => {
        $applicationStore.toggleVoice($currentUser)
        isMuted = !isMuted;
    }
    $: isMuted= $currentParticipant?.isMuted ?? true;
    $: isCameraOff= $currentParticipant?.isCameraOff ?? true;
</script>
<!--<pre>{$currentParticipant?.isCameraOff}</pre>
<pre>{$currentParticipant?.isMuted}</pre>
<pre>{isCameraOff}</pre>
<pre>{isMuted}</pre>-->
<div class="flex flex-row m-2 p-2">
    <ActionIcon on:click={() => $applicationStore.toggleCall(calleeId)}>
        {#if call === null}
            <span class="i-lucide-phone"></span>
        {:else}
            <span class="i-lucide-phone-off bg-red-600"/>
        {/if}
    </ActionIcon>
    {#if call?.state === 'Ringing'}
        <ActionIcon on:click={() => $applicationStore.answerCall()}>
            <span class="i-lucide-phone-incoming bg-green-500"/>
        </ActionIcon>
    {/if}
    <select bind:value={calleeId} class="bg-transparent border-none outline-none w-full">
        <option value="" selected>Select a user or group to call</option>
        {#each $groups as group}
            <option value={group.id}>
                <div class="rounded-full">
                    <Avatar src={group.avatar} radius="md"/>
                </div>
                {group.name}
            </option>
        {/each}
        <option value="">------------------------------</option>
        {#each $contacts as contact}
            <option value={contact.id}>
                <div class="rounded-full w-12">
                    <Avatar src={contact.avatar} radius="md"/>{contact.name} {contact.online ? 'online' : 'offline'}
                </div>
            </option>
        {/each}
    </select>
    <ActionIcon on:click={handleToggleCamera}>
        {#if isCameraOff}
            <span class="i-lucide-video-off"></span>
        {:else}
            <span class="i-lucide-video"></span>
        {/if}
    </ActionIcon>

    <ActionIcon on:click={handleToggleScreenShare}>
        {#if !isScreenSharing}
            <span class="i-lucide-monitor-off"></span>
        {:else}
            <span class="i-lucide-monitor"></span>
        {/if}
    </ActionIcon>

    <ActionIcon on:click={handleToggleVoice}>
        {#if isMuted}
            <span class="i-lucide-mic-off"></span>
        {:else}
            <span class="i-lucide-mic"></span>
        {/if}
    </ActionIcon>
    <Menu {opened} on:open={onOpen} {onClose}>
        <ActionIcon slot="control">
            {#if $volume === 0}
                <span class="i-lucide-volume-x"></span>
            {:else if $volume < 25}
                <span class="i-lucide-volume"></span>
            {:else if $volume < 50}
                <span class="i-lucide-volume-1"></span>
            {:else if $volume <= 100}
                <span class="i-lucide-volume-2"></span>
            {/if}
        </ActionIcon>
        <Slider bind:value={$volume}/>
    </Menu>
    <ActionIcon>
        <span class="i-lucide-more-vertical"></span>
    </ActionIcon>
</div>