<script lang="ts">
    import {ActionIcon} from "@svelteuidev/core";
    import {createEventDispatcher, onMount} from "svelte";
    import type {CallParticipant} from "@/interfaces/CallService/CallParticipant";
    import type {User} from "@/interfaces/User";
    import VideoContainer from "@components/Call/VideoContainer.svelte";
    import Avatar from "@components/Avatar.svelte";
    import type {MediaStreamInfo} from "@/interfaces/MediaStreamInfo";
    import {applicationStore} from "@stores/applicationStore";

    const dispatch = createEventDispatcher()

    // export let participant: CallParticipant
    export let streamInfo: MediaStreamInfo
    export let isCameraOff: boolean
    export let isMuted: boolean
    export let user: User;


</script>
<div>
    <div class="w-full h-full">
        {#if streamInfo?.stream && !isCameraOff}
            <VideoContainer stream={streamInfo.stream} muted={isMuted}/>
        {:else}
            <img class="w-full h-full object-cover" src={user?.avatar} alt={user?.name}/>
        {/if}
        <div class="absolute flex left-[12px] top-[12px] p-2">
            <ActionIcon on:click={()=>dispatch("video",user)} variant='filled' class="mr-2">
                {#if isCameraOff}
                    <span class="i-lucide-video-off text-gray-900"/>
                {:else}
                    <span class="i-lucide-video text-gray-900"/>
                {/if}
            </ActionIcon>
            <ActionIcon on:click={()=>dispatch("audio",user)} variant='filled'>
                {#if isMuted}
                    <span class="i-lucide-mic-off text-gray-900"/>
                {:else}
                    <span class="i-lucide-mic text-gray-900"/>
                {/if}
            </ActionIcon>
        </div>
    </div>
</div>


