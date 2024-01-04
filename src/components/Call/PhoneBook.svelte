<script lang="ts">
    import type {User} from "@/interfaces/User.js";
    import {ActionIcon} from "@svelteuidev/core";
    import {applicationStore} from "@stores/applicationStore";
    import type {Writable} from "svelte/store";

    export let users: User[] = [];
    $:currentUser = $applicationStore.userService.user;
    $: usersWithoutMe = users.filter(user => user.id !== $currentUser.id);

    async function handleCall(user) {
        await $applicationStore.toggleCall(user.id);
    }

</script>


<div class=" w-full h-full max-w-md mx-auto bg-gray-100  rounded shadow-md overflow-x-clip overflow-y-scroll">
    {#each usersWithoutMe as user (user.id)}
        <div class="flex items-center justify-between bg-white p-4 mb-2 rounded shadow-md">
            <div class="flex items-center">
                <img
                        src={user.avatar}
                        alt={user.name.first+" "+user.name.last}
                        class="w-10 h-10 rounded-full mr-4"
                />
                <div>
                    <p class="text-lg font-semibold">{user.name.first + " " + user.name.last}</p>
                    {#if user.online}
                        <div class="flex items-center">
                            <p class="text-sm text-green-500">Online</p>
                            <ActionIcon on:click={() => handleCall(user)}>
                                <span class="i-lucide-phone bg-green-500"/>
                            </ActionIcon>
                        </div>
                    {:else}
                        <p class="text-sm text-red-500">Offline</p>
                    {/if}
                </div>
            </div>
        </div>
    {/each}
</div>

<style>
    /* Add your Tailwind CSS styles here */
</style>
