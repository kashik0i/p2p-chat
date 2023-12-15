<script lang="ts">

    import Avatar from "@components/Avatar.svelte";
    import {Badge, Burger, Button, MediaQuery, Text, Tabs, ActionIcon, Menu} from "@svelteuidev/core";
    import {applicationStore} from "@stores/applicationStore";
    import {generateAvatar} from "@utils/avatar";

    const call = $applicationStore.callService.call;
    const user = $applicationStore.userService.user;
    let conversations = [
        {
            avatar:  generateAvatar("Annie"),
            name: "Annie",
            unread: 2
        },
        {
            avatar:  generateAvatar("Henry Boyd"),
            name: "Henry Boyd",
            unread: 3
        }, {
            avatar: generateAvatar("Cameron Williamson"),
            name: "Cameron Williamson",
            unread: 4
        }, {
            avatar: generateAvatar("Zachary"),
            name: "Zachary",
            unread: 1
        }, {
            avatar: generateAvatar("Elizabeth"),
            name: "Elizabeth",
            unread: 1
        }, {
            avatar: generateAvatar("Yang"),
            name: "Yang",
            unread: 1
        },
    ]
</script>


<MediaQuery query="(min-width: 600px)" styles={{ bc: '$blue50', d:"none" }}>
    <div class="flex flex-col py-8  pr-2  bg-white h-full w-full max-w-fit ">
        <div class="flex flex-row items-center h-12 w-full">
            <div
                    class="flex items-center w-10 rounded-full bg-indigo-500 flex-shrink-0 ml-4"
            >
                <Avatar src={$user.avatar} radius="md"/>
            </div>
        </div>
        <div class="flex flex-col mt-8 h-full">
            <div class="flex flex-col space-y-1 mt-4 -mx-2 h-64 overflow-auto scrollbar scrollbar-w-1 scrollbar-thumb-rounded  scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {#each conversations as {avatar, name, unread}}
                    <div class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 cursor-pointer">
                        <div>
<!--                            <strong class="relative inline-flex px-2.5 py-1.5 text-xs font-medium">-->
<!--                                <span class="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-green-600 flex justify-center items-center items">-->
<!--                                    {unread}-->
<!--                                </span>-->
                                <div class="w-8 bg-indigo-200 rounded-full">
                                    <Avatar src={avatar} radius="md"/>
                                </div>
<!--                            </strong>-->
                        </div>
                    </div>
                {/each}
            </div>
            <!--            Call Controls-->
            <!--                <div class="flex flex-row justify-between items-center mt-4">-->
            <!--                    <ActionIcon>-->
            <!--                        {#if $call.state === 'Idle'}-->
            <!--                            <span class="i-lucide-phone"></span>-->
            <!--                        {:else if $call.state === 'Ringing'}-->
            <!--                        {:else}-->
            <!--                            <span class="i-lucide-phone-off bg-red-600"></span>-->
            <!--                        {/if}-->
            <!--                    </ActionIcon>-->

            <!--                    <ActionIcon on:click={() => $applicationStore.callService.toggleCamera()}>-->
            <!--                        {#if !$call.isCameraOff}-->
            <!--                            <span class="i-lucide-video-off"></span>-->
            <!--                        {:else}-->
            <!--                            <span class="i-lucide-video"></span>-->
            <!--                        {/if}-->
            <!--                    </ActionIcon>-->

            <!--                    <ActionIcon on:click={() => $applicationStore.callService.toggleMute()}>-->
            <!--                        {#if !$call.isMuted}-->
            <!--                            <span class="i-lucide-mic-off"></span>-->
            <!--                        {:else}-->
            <!--                            <span class="i-lucide-mic"></span>-->
            <!--                        {/if}-->
            <!--                    </ActionIcon>-->
            <!--                    <Menu {opened} on:open={onOpen} {onClose}>-->
            <!--                        <ActionIcon slot="control">-->
            <!--                            {#if volume === 0}-->
            <!--                                <span class="i-lucide-volume-x"></span>-->
            <!--                            {:else if volume < 25}-->
            <!--                                <span class="i-lucide-volume"></span>-->
            <!--                            {:else if volume < 50}-->
            <!--                                <span class="i-lucide-volume-1"></span>-->
            <!--                            {:else if volume <= 100}-->
            <!--                                <span class="i-lucide-volume-2"></span>-->
            <!--                            {/if}-->
            <!--                        </ActionIcon>-->
            <!--                        <Slider bind:value={volume}/>-->
            <!--                    </Menu>-->
            <!--                    <ActionIcon>-->
            <!--                        <span class="i-lucide-more-vertical"></span>-->
            <!--                    </ActionIcon>-->
            <!--                </div>-->
        </div>
    </div>
</MediaQuery>
<!-- Small screen -->
<MediaQuery query="(max-width: 600px)" styles={{ bc: '$blue50', d:"none" }}>
    <div class="flex flex-col py-8  pr-2  bg-white h-full w-full max-w-fit ">
        <div class="flex flex-row items-center justify-center h-12 w-full">
            <div
                    class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
            >
                <Avatar radius="md"/>
            </div>
        </div>
        <div class="flex flex-col mt-8 h-full">
            <div class="flex flex-row items-center justify-between text-xs">
                <span class="font-bold">Active Conversations</span>
                <Badge color="red" size="sm">2</Badge>
            </div>
            <div class="flex flex-col space-y-1 mt-4 -mx-2 h-64 overflow-y-auto scrollbar scrollbar-w-1 scrollbar-thumb-rounded  scrollbar-thumb-gray-300 scrollbar-track-gray-100 ">
                {#each conversations as {avatar, name}}
                    <div class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 cursor-pointer">
                        <div class="flex items-center justify-center w-8 bg-indigo-200 rounded-full">
                            <Avatar src={avatar} radius="md"/>
                        </div>
                        <div class="flex ml-2 items-center">
                            <div class="ml-2 text-sm font-semibold">{name}</div>
                            <Badge color="red" size="sm" class="ml-2 w-7">2</Badge>
                        </div>
                    </div>
                {/each}
            </div>
            <!--            Call Controls-->
            <!--                <div class="flex flex-row justify-between items-center mt-4">-->
            <!--                    <ActionIcon>-->
            <!--                        {#if $call.state === 'Idle'}-->
            <!--                            <span class="i-lucide-phone"></span>-->
            <!--                        {:else if $call.state === 'Ringing'}-->
            <!--                        {:else}-->
            <!--                            <span class="i-lucide-phone-off bg-red-600"></span>-->
            <!--                        {/if}-->
            <!--                    </ActionIcon>-->

            <!--                    <ActionIcon on:click={() => $applicationStore.callService.toggleCamera()}>-->
            <!--                        {#if !$call.isCameraOff}-->
            <!--                            <span class="i-lucide-video-off"></span>-->
            <!--                        {:else}-->
            <!--                            <span class="i-lucide-video"></span>-->
            <!--                        {/if}-->
            <!--                    </ActionIcon>-->

            <!--                    <ActionIcon on:click={() => $applicationStore.callService.toggleMute()}>-->
            <!--                        {#if !$call.isMuted}-->
            <!--                            <span class="i-lucide-mic-off"></span>-->
            <!--                        {:else}-->
            <!--                            <span class="i-lucide-mic"></span>-->
            <!--                        {/if}-->
            <!--                    </ActionIcon>-->
            <!--                    <Menu {opened} on:open={onOpen} {onClose}>-->
            <!--                        <ActionIcon slot="control">-->
            <!--                            {#if volume === 0}-->
            <!--                                <span class="i-lucide-volume-x"></span>-->
            <!--                            {:else if volume < 25}-->
            <!--                                <span class="i-lucide-volume"></span>-->
            <!--                            {:else if volume < 50}-->
            <!--                                <span class="i-lucide-volume-1"></span>-->
            <!--                            {:else if volume <= 100}-->
            <!--                                <span class="i-lucide-volume-2"></span>-->
            <!--                            {/if}-->
            <!--                        </ActionIcon>-->
            <!--                        <Slider bind:value={volume}/>-->
            <!--                    </Menu>-->
            <!--                    <ActionIcon>-->
            <!--                        <span class="i-lucide-more-vertical"></span>-->
            <!--                    </ActionIcon>-->
            <!--                </div>-->
        </div>
    </div>
</MediaQuery>

