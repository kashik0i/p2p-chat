<script lang="ts">
    import {Base64} from 'js-base64';
    import {
        colorScheme,
        SvelteUIProvider,
        Stack,
        Switch,
        Text,
        Tabs,
        NativeSelect,
        Image,
        FileUpload, Loader, Button
    } from '@svelteuidev/core';
    import {Reset, Trash, Upload, File} from "radix-icons-svelte";
    import {applicationStore} from "@stores/applicationStore";
    import type {User} from "@/interfaces/User.js";
    import type {Writable} from "svelte/store";
    import {fileToBase64, fileToByteArray, generateAvatar} from "@/utils";
    import Avatar from "@components/Avatar.svelte";

    let loading = false;
    const currentUser: Writable<User> = $applicationStore.userService.user;
    const toggleTheme = () => {
        colorScheme.update((v) => (v === 'light' ? 'dark' : 'light'))
    }

    const handleFileUpload = async (e) => {
        try {
            const {file} = e.detail[0];
            if (!file) return;
            loading = true;
            let base64 = await fileToBase64(file);
            currentUser.update((v) => ({...v, avatar: base64}));
        } catch (e) {
            console.log(e);
        }
        loading = false;
    }

    const handleReset = (e) => {
        console.log(e.detail);
    }
    let handleGenerateAvatar = () => {
        try {
            loading = true;
            const random = Math.floor(Math.random() * 1000).toString();
            let avatar = generateAvatar(random);
            currentUser.update((v) => ({...v, avatar}));
        } catch (e) {
            console.log(e);
        }
        loading = false;
    }
</script>
<div class="p-4 overflow-y-scroll scrollbar scrollbar-w-1 scrollbar-thumb-rounded  scrollbar-thumb-gray-300 scrollbar-track-gray-100"
     style="height: 100vh">
    <div class="shadow rounded-lg p-6 ">
        <h1 class="text-xl font-semibold mb-4">Personal Information</h1>
        <div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="First name" class="border p-2 rounded w-full"
                       bind:value={$currentUser.name.first}>
                <input type="text" placeholder="Last name" class="border p-2 rounded w-full"
                       bind:value={$currentUser.name.last}>
            </div>
            <div class="mb-4">
                <input type="email" placeholder="Email address" class="border p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <div class="flex flex-col w-1/3 min-w-[200px] ">
                    <label>Avatar</label>
                    {#if loading}
                        <Loader color='green' size='lg'/>
                    {:else }
                        <div class="w-fit mb-4">
                            <Avatar src={$currentUser.avatar} radius="md" size='lg'/>
                        </div>
                    {/if}
                    <div class="flex items-center justify-between mb-4">
                        <FileUpload multiple={false} on:selected={handleFileUpload} reset={false} preview={false}/>
                        <Button on:click={handleGenerateAvatar} size="sm" color="primary" outline>
                            Randomize
                        </Button>
                    </div>
                </div>
            </div>
            <Switch on:change={toggleTheme} onLabel="dark" offLabel="light" size="xl"/>
        </div>
    </div>
</div>