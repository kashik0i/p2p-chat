<script lang="ts">
    import {colorScheme, SvelteUIProvider, Stack, Switch, Text, Tabs} from '@svelteuidev/core';
    import HomeLayout from "@/layout/HomeLayout.svelte";
    import {writable} from "svelte/store";
    import ChatLayout from "@/layout/ChatLayout.svelte";
    import CallLayout from "@/layout/CallLayout.svelte";
    import {ChatBubble, Mobile, Gear} from "radix-icons-svelte";
    import SettingsLayout from "@/layout/SettingsLayout.svelte";
    import Navigation from "@components/Navigation/Navigation.svelte";
    import {onMount} from "svelte";
    import PhoneBook from "@components/Call/PhoneBook.svelte";
    import {applicationStore} from "@stores/applicationStore";
    import AppFileSystem from "@components/AppFileSystem.svelte";

    type AppState = 'home'| 'phone' | 'message' | 'hard-drive' | 'users' | 'settings'
    let layout = writable<AppState>("phone")
    let users = $applicationStore.users
    onMount(()=>{

    })

    window.requestFileSystem = window.requestFileSystem ||  // Chrome
        window.webkitRequestFileSystem;  // Others
    /*window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function (fs) {
        console.log('file system open: ' + fs.name);

    }, (e) => {
        console.log(e);
    });*/
</script>
<SvelteUIProvider withNormalizeCSS withGlobalStyles themeObserver={$colorScheme}>
    <div class="flex h-screen w-screen">
        <div class="flex h-full">
            <!--            <Tabs orientation="vertical" class="h-full" on:change={updateLayout}>-->
            <!--                <Tabs.Tab icon={ChatBubble} on:click={()=>updateLayout("home")}/>-->
            <!--                <Tabs.Tab icon={Mobile} on:click={()=>updateLayout("call")}/>-->
            <!--                <Tabs.Tab icon={Gear} class="absolute bottom-0 left-0 w-fit"/>-->
            <!--            </Tabs>-->
            <Navigation bind:active={$layout}/>
        </div>
        <div class="h-full w-full ">
            {#if $layout === "home"}
                <HomeLayout/>
            {/if}
            {#if $layout === "message"}
                <ChatLayout/>
            {/if}
            {#if $layout === "phone"}
                <CallLayout/>
            {/if}
            {#if $layout === "hard-drive"}
               <AppFileSystem/>
            {/if}
            {#if $layout === "users"}
                <PhoneBook users={$users}/>
            {/if}
            {#if $layout === "settings"}
                <SettingsLayout/>
            {/if}
        </div>
    </div>
</SvelteUIProvider>


