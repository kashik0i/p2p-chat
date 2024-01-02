<script lang="ts">
    import {afterUpdate, onMount} from "svelte";
    import initLayoutContainer from "opentok-layout-js";
    import {useViewportSize} from "@svelteuidev/composables";
    import type {CallParticipant} from "@/interfaces/CallService/CallParticipant";
    import {applicationStore} from "@stores/applicationStore";
    import CallGridItem from "@components/Call/CallGrid/CallGridItem.svelte";

    const options = {
        maxRatio: 3 / 2,             // The narrowest ratio that will be used (default 2x3)
        minRatio: 9 / 16,            // The widest ratio that will be used (default 16x9)
        fixedRatio: false,         // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
        fixedRatioClass: "OT_fixedRatio", // The class to add to elements that should respect their native aspect ratio
        scaleLastRow: true,        // If there are less elements on the last row then we can scale them up to take up more space
        alignItems: 'center',      // Can be 'start', 'center' or 'end'. Determines where to place items when on a row or column that is not full
        bigClass: "OT_big",        // The class to add to elements that should be sized bigger
        bigPercentage: 0.8,        // The maximum percentage of space the big ones should take up
        minBigPercentage: 0,       // If this is set then it will scale down the big space if there is left over whitespace down to this minimum size
        bigFixedRatio: false,      // fixedRatio for the big ones
        bigScaleLastRow: true,     // scale last row for the big elements
        bigAlignItems: 'center',   // How to align the big items
        smallAlignItems: 'center', // How to align the small row or column of items if there is a big one
        maxWidth: Infinity,        // The maximum width of the elements
        maxHeight: Infinity,       // The maximum height of the elements
        smallMaxWidth: Infinity,   // The maximum width of the small elements
        smallMaxHeight: Infinity,  // The maximum height of the small elements
        bigMaxWidth: Infinity,     // The maximum width of the big elements
        bigMaxHeight: Infinity,    // The maximum height of the big elements
        bigMaxRatio: 3 / 2,          // The narrowest ratio to use for the big elements (default 2x3)
        bigMinRatio: 9 / 16,         // The widest ratio to use for the big elements (default 16x9)
        bigFirst: true,            // Whether to place the big one in the top left (true) or bottom right (false).
                                   // You can also pass 'column' or 'row' to change whether big is first when you are in a row (bottom) or a column (right) layout
        animate: true,             // Whether you want to animate the transitions using jQuery (not recommended, use CSS transitions instead)
        window: window,            // Lets you pass in your own window object which should be the same window that the element is in
        ignoreClass: 'OT_ignore',  // Elements with this class will be ignored and not positioned. This lets you do things like picture-in-picture
        onLayout: null,            // A function that gets called every time an element is moved or resized, (element, { left, top, width, height }) => {}
    };
    let layoutElement: HTMLDivElement;
    export let layout;
    export let participants: CallParticipant[] = [];
    $: participantsFlat = participants?.flatMap(({id, stream, isMuted, isCameraOff, status}) => {
        const user = $users.find(u => u.id === id)
        if (!stream.length) return {user, undefined, isMuted, isCameraOff, status}
        return stream.map(stream => ({user, stream, isMuted, isCameraOff, status}))
    }) ?? []
    afterUpdate(() => {
        layout.layout();
    });
    const size = useViewportSize();
    onMount(async () => {
        layout = initLayoutContainer(layoutElement, options);
        layout.layout();
        const unsubscribe = size.subscribe((_) => {
            layout.layout();
        });
        $applicationStore.callService.layout = layout
        return () => {
            unsubscribe();
        }
    });
    let users = $applicationStore.users
    let currentUser = $applicationStore.userService.user

    const isCurrentUser = (user) => user.id === $currentUser.id
</script>
<!--<button on:click={()=>layout.layout()}>layout</button>-->
<div bind:this={layoutElement} class="layoutContainer p-2 m-2">
    {#each participantsFlat as {user, stream, isMuted, isCameraOff, status}}
        {#if status === 'Answered'}
            <CallGridItem streamInfo={stream} {user} {isCameraOff} isMuted={isMuted||isCurrentUser(user)} on:video
                          on:audio/>
        {/if}
    {/each}
</div>


<style>

    .layoutContainer {
        width: calc(100% - 2rem);
        height: 100%;
        background-color: #DDD;
        position: relative;
    }
</style>