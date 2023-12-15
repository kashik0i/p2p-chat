<script lang="ts">
    import {
        ActionIcon,
        AppShell,
        Aside, Burger,
        colorScheme, Container, Flex,
        Footer,
        Header, Menu,
        Navbar,
        Tabs
    } from "@svelteuidev/core";
    import Avatar from "@components/Avatar.svelte";
    import ChatNav from "@components/Chat/ChatNav.svelte";
    import Chat from "@components/Chat/Chat.svelte";
    import {Camera, EnvelopeClosed, Gear, Slider} from 'radix-icons-svelte';
    import {applicationStore} from "@stores/applicationStore";

    const call = $applicationStore.callService.call;

    let opened = false;

    function toggleTheme() {
        colorScheme.update((v) => (v === 'light' ? 'dark' : 'light'));
    }

    function onOpen() {
    }

    function onClose() {
    }

    let volume = 0;
</script>

<div class="flex flex-col w-full h-full antialiased text-gray-800">
    <div class="flex flex-row h-full w-full overflow-x-hidden">
        <ChatNav/>
        <Chat/>
    </div>
    <!--    <div class="flex w-full flex-row justify-center items-center">-->
    <!--        &lt;!&ndash;                    Call Controls&ndash;&gt;-->
    <!--        <div class="flex flex-row justify-between items-center mt-4">-->
    <!--            <ActionIcon>-->
    <!--                {#if $call.state === 'Idle'}-->
    <!--                    <span class="i-lucide-phone"></span>-->
    <!--                {:else if $call.state === 'Ringing'}-->
    <!--                {:else}-->
    <!--                    <span class="i-lucide-phone-off bg-red-600"></span>-->
    <!--                {/if}-->
    <!--            </ActionIcon>-->

    <!--            <ActionIcon on:click={() => $applicationStore.callService.toggleCamera()}>-->
    <!--                {#if !$call.isCameraOff}-->
    <!--                    <span class="i-lucide-video-off"></span>-->
    <!--                {:else}-->
    <!--                    <span class="i-lucide-video"></span>-->
    <!--                {/if}-->
    <!--            </ActionIcon>-->

    <!--            <ActionIcon on:click={() => $applicationStore.callService.toggleMute()}>-->
    <!--                {#if !$call.isMuted}-->
    <!--                    <span class="i-lucide-mic-off"></span>-->
    <!--                {:else}-->
    <!--                    <span class="i-lucide-mic"></span>-->
    <!--                {/if}-->
    <!--            </ActionIcon>-->
    <!--            <Menu {opened} on:open={onOpen} {onClose}>-->
    <!--                <ActionIcon slot="control">-->
    <!--                    {#if volume === 0}-->
    <!--                        <span class="i-lucide-volume-x"></span>-->
    <!--                    {:else if volume < 25}-->
    <!--                        <span class="i-lucide-volume"></span>-->
    <!--                    {:else if volume < 50}-->
    <!--                        <span class="i-lucide-volume-1"></span>-->
    <!--                    {:else if volume <= 100}-->
    <!--                        <span class="i-lucide-volume-2"></span>-->
    <!--                    {/if}-->
    <!--                </ActionIcon>-->
    <!--                <Slider bind:value={volume}/>-->
    <!--            </Menu>-->
    <!--            <ActionIcon>-->
    <!--                <span class="i-lucide-more-vertical"></span>-->
    <!--            </ActionIcon>-->
    <!--        </div>-->
</div>





