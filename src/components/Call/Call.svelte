<script lang="ts">
    import {onMount} from "svelte";
    import Peer from "peerjs";
    import {applicationStore} from "@stores/applicationStore";
    import {selfId} from "trystero";
    import {NativeSelect} from "@svelteuidev/core";

    let userVideoSrc: HTMLVideoElement;
    let otherUserVideoSrc: HTMLVideoElement;
    $: console.log(userVideoSrc, otherUserVideoSrc);
    // $: userId = $applicationStore.userService.user.id;
    $: userId = $applicationStore.peerService.selfId;
    const peers = $applicationStore.peerService.peers;
    let options: string[] = [];
    let selected: string;
    let peer: Peer;
    onMount(async () => {
        peers.subscribe(peers => {
            options = peers.map(peer => peer);
        })
        try {
            peer = new Peer(userId);
            userVideoSrc.srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            peer.on('open', id => {
                console.log(id);
            });
            peer.on('call', call => {
                call.answer(userVideoSrc.srcObject);
                call.on('stream', stream => {
                    otherUserVideoSrc.srcObject = stream;
                })
            })

        } catch (e) {
            console.log(e);
        }

    })

    function call(id: string) {
        if (!id) {
            alert('Please select a user to call');
            return;
        }

        const call = peer.call(id, userVideoSrc.srcObject);
        call.on('stream', stream => {
            otherUserVideoSrc.srcObject = stream;
        })

    }
</script>
<div class="container">
    <div>
        {selected}
        <NativeSelect bind:value={selected} bind:data={options}/>
    </div>
    <div class="video-container">
        <video id="current-user" autoplay bind:this={userVideoSrc}/>
        <video id="other" autoplay bind:this={otherUserVideoSrc}/>
    </div>
    <div class="controls">
        <button class="m-2" on:click={() => call(selected)}>
            <span class="i-mdi-call"/>
        </button>
        <button>
            <span class="i-mdi-call-end"/>
        </button>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .video-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100%;
    }

    video {
        width: 50%;
        height: 50%;
        border: 1px solid black;
    }

    .controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
