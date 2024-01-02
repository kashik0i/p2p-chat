<script lang="ts">
    import {applicationStore} from "@stores/applicationStore";
    import type {User} from "@/interfaces/User";
    import CallGridManager from "@components/Call/CallGrid/CallGridManager.svelte";

    let users = $applicationStore.users
    const handleToggleCamera = ({detail: user}) => {
        $applicationStore.toggleCamera(user)
    };
    const handleToggleAudio = (user: User) => {
        $applicationStore.toggleVoice(user)

    };
    let currentCall = $applicationStore.callService.currentCall
    $: participants = $currentCall?.participants

</script>
<CallGridManager participants={$participants}
                 on:video={handleToggleCamera} on:audio={handleToggleAudio}
/>

