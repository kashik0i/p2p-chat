<script lang="ts">
    import VideoCallManager from "@components/CallManager/VideoCallManager.svelte";
    import {onMount} from "svelte";
    import {applicationStore} from "@stores/applicationStore.js";
    import {ActionIcon, NativeSelect} from "@svelteuidev/core";
    import type {User} from "@/interfaces/User";
    import {get} from "svelte/store";
    import VideoContainer from "@components/CallManager/VideoContainer.svelte";
    import type {MediaStreamInfo} from "@/interfaces/MediaStreamInfo";
    import Controls from "@components/CallManager/Controls.svelte";

    let videoManager: typeof VideoCallManager;

    let currentCall;
    let calleeId;
    let users = new Map<string, User>();
    let userStreams: MediaStream[] = [];
    let remoteStreams: MediaStream[] = [];
    onMount(() => {
        let usersUnsubscribe = $applicationStore.peerService.peers.subscribe(value => {
            console.log(value)
            users = value;
        })
        let currentCallUnsubscribe = $applicationStore.callService.instance.subscribe(value => {
            userStreams = value.localMediaStream.map(stream => stream.stream);
            remoteStreams = value.remoteMediaStream.map(stream => stream.stream);
            currentCall = value;
        })

        return () => {
            currentCallUnsubscribe();
            usersUnsubscribe();
        }
    })

    async function call() {
        if (!calleeId) {
            alert('Please select a user to call');
            return;
        }

        await $applicationStore.callService.callUser(calleeId);

    }


</script>

<div class="flex flex-col items-center w-full h-full">
    <VideoCallManager bind:this={videoManager}>
        {#each userStreams as stream}
            <VideoContainer
                    bind:stream={stream}
                    muted={true}
            />
        {/each}
        {#each remoteStreams as stream}
            <VideoContainer
                    stream={stream}
                    muted={false}
            />
        {/each}
    </VideoCallManager>
    <div class="h-16">
        <Controls/>
    </div>
    <!--    <VideoCallManager bind:this={videoManager}/>-->
</div>
