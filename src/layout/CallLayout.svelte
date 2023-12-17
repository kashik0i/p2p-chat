<script lang="ts">
    import VideoCallManager from "@components/CallManager/VideoCallManager.svelte";
    import {onMount} from "svelte";
    import {applicationStore} from "@stores/applicationStore.js";
    import {ActionIcon, NativeSelect} from "@svelteuidev/core";
    import type {User} from "@/interfaces/User";
    import {get} from "svelte/store";
    import VideoContainer from "@components/CallManager/VideoContainer.svelte";
    import type {MediaStreamInfo} from "@/interfaces/MediaStreamInfo";

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
            // videoManager.containers = [
            //     [...value.localMediaStream.map(stream => {
            //         return {
            //             stream,
            //             muted: true,
            //         }
            //     })],
            //     [...value.remoteMediaStream.map(stream => {
            //         return {
            //             stream,
            //             muted: false,
            //         }
            //     })],
            //     value.remoteMediaStream
            // ]
            console.log(value)
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

    // function hangup() {
    // $applicationStore.callService.hangup();
    // }

    // function answer() {
    //     $applicationStore.callService.answer();
    // }

    // function reject() {
    //     $applicationStore.callService.reject();
    // }

</script>

<div class="flex flex-col items-center w-full h-full">
    <div class="flex flex-row items-center justify-center w-full ">
        <select bind:value={calleeId}>
            <option value="">Select a user or group to call</option>
            <option value={import.meta.env.VITE_GLOBAL_CHAT_ID}>Global Chat</option>
            {#each Array.from(users.values()) as user}
                <option value={user.id}>{user?.name?.first} {user?.name?.last}</option>
            {/each}
        </select>
        <ActionIcon on:click={call}>Call</ActionIcon>
        <!--        <div class="flex flex-row items-center justify-center w-full ">-->
        <!--            <ActionIcon on:click={() => $applicationStore.callService.hangup()}>Hangup</ActionIcon>-->
        <!--            <ActionIcon on:click={() => $applicationStore.callService.answer()}>Answer</ActionIcon>-->
        <!--            <ActionIcon on:click={() => $applicationStore.callService.reject()}>Reject</ActionIcon>-->
        <!--        </div>-->
    </div>
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
    <!--    <VideoCallManager bind:this={videoManager}/>-->
</div>
