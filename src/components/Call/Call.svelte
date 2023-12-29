<script lang="ts">
    import {onMount} from "svelte";
    import Controls from "@components/Call/Controls.svelte";
    import {applicationStore} from "@stores/applicationStore";
    import type {PeerCall} from "@/interfaces/CallService";
    import VideoCallManager from "@components/Call/VideoCallManager.svelte";
    import {derived, get, type Readable, writable} from "svelte/store";
    import CallGrid from "@components/Call/CallGrid/CallGrid.svelte";
    import type {CallParticipant} from "@/interfaces/CallService/CallParticipant";

    let call: PeerCall | null = null;
    // let participants = writable<CallParticipant[]>([]);
    $: participants = call?.participants ?? writable([]);
    onMount(async () => {
        console.log("onMount");
        const callUnsubscribe = $applicationStore.callService.currentCall.subscribe((_call) => {
            call = _call
        });

        return () => {
            callUnsubscribe();
        }
    });

    let videoManager: typeof VideoCallManager;

    // interface MediaControls {
    //     // volume: number;
    //     isCameraOff: boolean;
    //     isScreenSharing: boolean;
    //     isMuted: boolean;
    // }

    /*let mediaControls: Readable<MediaControls> = derived(
        [participants, $applicationStore.userService.user],
        ([participants, user], set) => {
            const currentParticipant = participants.find(p => p.id === user.id);
            set({
                // volume: call?.participants?.volume ?? 50,
                isCameraOff: currentParticipant?.isCameraOff ?? false,
                // isScreenSharing: currentParticipant?.isScreenSharing ?? false,
                isMuted: currentParticipant?.isMuted ?? false,
            })
        }
    )*/

</script>
<div class="flex flex-col w-full h-full">
    <div class="flex-grow">
        <CallGrid participants={$participants}/>
    </div>
    <div class="h-16">
        <Controls/>
    </div>
</div>

<!--<CallModal bind:callRequest={currentCall}/>-->




