<script lang="ts">


    import {applicationStore} from "@stores/applicationStore";
    import {CallStateEnum} from "@/enums/CallStateEnum";
    import {Modal} from "@svelteuidev/core";
    import {onMount} from "svelte";
    import ringtoneSrc from "@assets/ringtone.mp3";

    export let opened = false;
    let ringtone:HTMLAudioElement;
    onMount(()=>{
        // $applicationStore.callService.onCallStateChange((call)=>{
        //     if(call.state === CallStateEnum.RINGING){
        //         opened = true;
        //     }
        // })
        const unsubscribe = $applicationStore.callService.currentCall.subscribe((currentCall)=>{
            if(currentCall?.state === CallStateEnum.Ringing){
                opened = true;
                // play ringtone
                ringtone.play();
            }
            if(currentCall?.state === CallStateEnum.Ended){
                opened = false;
                // stop ringtone
                ringtone.pause();
                ringtone.currentTime = 0;
            }
        })
        return ()=>{
            unsubscribe();
        }
    })
   const handleAnswer=async () => {
       await $applicationStore.answerCall();
       opened = false;
       ringtone.pause();
   }
    const handleReject=async () => {
        await $applicationStore.rejectCall();
        opened = false;
        ringtone.pause();
    }



</script>
<Modal bind:opened on:close={() => opened = false}>
    <div class="flex items-center justify-center w-full h-full ">
            <div class="bg-white p-8 rounded shadow-md">
                <h2 class="text-2xl font-semibold mb-4">Incoming Call</h2>
                <div class="flex justify-between">
                    <button
                            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline-green"
                            on:click={handleAnswer}
                    >
                        Answer
                    </button>
                    <button
                            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline-red"
                            on:click={handleReject}
                    >
                        Reject
                    </button>
                </div>
            </div>
    </div>
</Modal>
<audio bind:this={ringtone} id="ringtone" src={ringtoneSrc}  loop hidden></audio>

<style>


</style>