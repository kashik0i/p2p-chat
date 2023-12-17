<script lang="ts" xmlns="http://www.w3.org/1999/html">
    import {colorScheme, SvelteUIProvider, Stack, Switch, Text, Tabs} from '@svelteuidev/core';
    import HomeLayout from "@/layout/HomeLayout.svelte";
    import {writable} from "svelte/store";
    import ChatLayout from "@/layout/ChatLayout.svelte";
    import CallLayout from "@/layout/CallLayout.svelte";
    import {ChatBubble, Mobile, Gear} from "radix-icons-svelte";
    import SettingsLayout from "@/layout/SettingsLayout.svelte";

    type AppState = "home" | "chat" | "call" | "settings"
    let layout = writable<AppState>("call")

    const updateLayout = (e) => {
        const index = e.detail.index;
        switch (index) {
            case 0:
                layout.set("chat")
                break;
            case 1:
                layout.set("call")
                break;
            case 2:
                layout.set("settings")
                break;
            default:
                layout.set("home")
        }
    }


</script>
<SvelteUIProvider withGlobalStyles themeObserver={$colorScheme}>
    <div class="flex h-screen w-screen">
        <div class="flex h-full">
            <Tabs orientation="vertical" class="h-full" on:change={updateLayout}>
                <Tabs.Tab icon={ChatBubble} on:click={()=>updateLayout("home")}/>
                <Tabs.Tab icon={Mobile} on:click={()=>updateLayout("call")}/>
                <Tabs.Tab icon={Gear} class="absolute bottom-0 left-0 w-fit"/>
            </Tabs>
        </div>
        <div class="h-full w-full ">
            {#if $layout === "home"}
                <HomeLayout/>
            {/if}
            {#if $layout === "chat"}
                <ChatLayout/>
            {/if}
            {#if $layout === "call"}
                <CallLayout/>
            {/if}
            {#if $layout === "settings"}
                <SettingsLayout/>
            {/if}
        </div>
    </div>
</SvelteUIProvider>

<style>


</style>
