<script lang="ts">
    import { Base64 } from 'js-base64';
    import {
        colorScheme,
        SvelteUIProvider,
        Stack,
        Switch,
        Text,
        Tabs,
        NativeSelect,
        Image,
        FileUpload
    } from '@svelteuidev/core';
    import {Reset, Trash, Upload} from "radix-icons-svelte";
    import {applicationStore} from "@stores/applicationStore";
    import type {User} from "@/interfaces/User.js";
    import type {Writable} from "svelte/store";

    const currentUser:Writable<User> = $applicationStore.userService.user;
    const toggleTheme = () => {
        colorScheme.update((v) => (v === 'light' ? 'dark' : 'light'))
    }

    const handleFileUpload = async (e) => {
        const image = e.detail as File;
        if (!image) return;
        const buffer = await image.arrayBuffer();
        const array = new Uint8Array(buffer);
        const base64 = Base64.fromUint8Array(array);
        currentUser.update((v) => ({...v, avatar: base64}));
    }

    const handleReset = (e) => {
        console.log(e.detail);
    }
</script>
<div class="p-4 overflow-y-scroll scrollbar scrollbar-w-1 scrollbar-thumb-rounded  scrollbar-thumb-gray-300 scrollbar-track-gray-100"
     style="height: 100vh">
    <div class="shadow rounded-lg p-6 ">
        <h1 class="text-xl font-semibold mb-4">Personal Information</h1>
        <form>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="First name" class="border p-2 rounded w-full">
                <input type="text" placeholder="Last name" class="border p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <input type="email" placeholder="Email address" class="border p-2 rounded w-full">
            </div>
            <div class="mb-4">
                <div class="flex flex-col ">
                    <label>Avatar</label>
                    <Image src={$currentUser.avatar} alt="" class="rounded-lg w-fit h-fit mb-4"/>
                    <FileUpload multiple={false}
                                icon={Upload}
                                fileIcon={File}
                                removeIcon={Trash}
                                resetIcon={Reset}
                                on:selected={handleFileUpload}/>
                </div>
            </div>
            <!--            <div class="mb-4">-->
            <!--                <NativeSelect data={} placeholder=""/>-->
            <!--            </div>-->
            <!--            <div class="mb-4">-->
            <!--                <input type="text" placeholder="Street address" class="border p-2 rounded w-full">-->
            <!--            </div>-->
            <!--            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">-->
            <!--                <input type="text" placeholder="City" class="border p-2 rounded w-full">-->
            <!--                <input type="text" placeholder="State / Province" class="border p-2 rounded w-full">-->
            <!--                <input type="text" placeholder="ZIP / Postal code" class="border p-2 rounded w-full">-->
            <!--            </div>-->
            <!--            <div class="mb-4">-->
            <!--                <label class="inline-flex items-center">-->
            <!--                    <input type="checkbox" class="form-checkbox h-5 w-5 text-gray-600"><span-->
            <!--                        class="ml-2 text-gray-700">I agree to the <a href="#"-->
            <!--                                                                     class="underline">privacy policy</a></span>-->
            <!--                </label>-->
            <!--            </div>-->
            <Switch on:change={toggleTheme} onLabel="dark" offLabel="light"/>
        </form>
    </div>
</div>