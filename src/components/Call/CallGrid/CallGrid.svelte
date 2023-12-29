<script lang="ts">
    import {ActionIcon, SimpleGrid, Loader} from "@svelteuidev/core";

    import type {CallParticipant} from "@/interfaces/CallService/CallParticipant";
    import VideoContainer from "@components/Call/VideoContainer.svelte";
    import {applicationStore} from "@stores/applicationStore";
    import Avatar from "@components/Avatar.svelte";
    import type {User} from "@/interfaces/User";

    let users = $applicationStore.users
    export let participants: CallParticipant[] = []
    const handleToggleCamera = (user: User) => {
        $applicationStore.toggleCamera(user)
    };
    const handleToggleAudio = (user: User) => {
        $applicationStore.toggleVoice(user)

    };
    $: currentUser = $applicationStore.userService.user
</script>

<SimpleGrid class="h-[90vh] " breakpoints={[
        { maxWidth: 980, cols: 3, spacing: 'md' },
        { maxWidth: 755, cols: 2, spacing: 'sm' },
        { maxWidth: 600, cols: 1, spacing: 'sm' }
    ]} cols={3}>
    {#each participants as participant}
        {@const user = $users.find(u => u.id === participant.id)}
        <div class="block relative tile">
            {#if !participant.stream.length}
                {#if user}
                    <div class="rounded-full">
                        <Avatar src={user.avatar}  />
                    </div>
                {:else}
                    <div class="w-full h-full flex justify-center items-center  rounded-md ">
                        <Loader size={50}/>
                    </div>
                {/if}

            {:else}
                {@const isCurrentUser = $currentUser.id === participant.id}
                <div class="w-full ">
                    <VideoContainer stream={participant.stream[0].stream}
                                    muted={isCurrentUser || participant.isMuted}
                    />
                </div>
            {/if}
            <div class="absolute flex left-[12px] top-[12px] p-2">
                <ActionIcon on:click={()=>handleToggleCamera(user)} variant='filled' class="mr-2">
                    {#if participant.isCameraOff}
                        <span class="i-lucide-video-off text-gray-900"/>
                    {:else}
                        <span class="i-lucide-video text-gray-900"/>
                    {/if}
                </ActionIcon>
                <ActionIcon on:click={()=>handleToggleAudio(user)} variant='filled'>
                    {#if participant.isMuted}
                        <span class="i-lucide-mic-off text-gray-900"/>
                    {:else}
                        <span class="i-lucide-mic text-gray-900"/>
                    {/if}
                </ActionIcon>
            </div>
        </div>
    {/each}
</SimpleGrid>

<style>
    .tile {
        margin: 0.5rem;
        /*background: #fff;*/
        /*border-radius: 0.5rem;*/
        /*box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);*/
        overflow: hidden;
    }

    .tile:hover {
        opacity: 0.8;
    }
</style>