<script lang="ts">
    import Seen from "@components/Chat/Message/Seen.svelte";
    import Avatar from "@components/Avatar.svelte";
    import Message from "@components/Chat/Message/Message.svelte";
    import ContextMenu from "@components/ContextMenu.svelte";
    import {Divider, Menu} from "@svelteuidev/core";
    import {Camera, ChatBubble, Gear, MagnifyingGlass, Trash, Width} from "radix-icons-svelte";

    export let avatar = "";
    export let seen = false;
    export let message: Message;
    let over=false;
</script>
<div class="col-start-6 col-end-13 p-3 rounded-lg">
    <div class="flex items-center justify-start flex-row-reverse" on:mouseenter={()=>over=true}
         on:mouseleave={()=>over=false}>
        <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
            <Avatar bind:src={avatar} radius="xl" slot="avatar"/>
        </div>
        <div class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
            <div>
                <slot name="message"/>
            </div>
            {#if seen}
                <Seen/>
            {/if}
        </div>
        <div class="block transition duration-300 ease-in-out" >
            <Menu trigger='hover' >
                <Menu.Label>Application</Menu.Label>
                <Menu.Item icon={Gear}>Settings</Menu.Item>
                <Menu.Item icon={ChatBubble}>Messages</Menu.Item>
                <Menu.Item icon={Camera}>Gallery</Menu.Item>
                <Menu.Item icon={MagnifyingGlass}>
                    <svelte:fragment slot='rightSection'>
                        <p size="xs" color="dimmed">⌘K</p>
                    </svelte:fragment>
                    Search
                </Menu.Item>

                <Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item icon={Width}>Transfer my data</Menu.Item>
                <Menu.Item color="red" icon={Trash}>Delete my account</Menu.Item>
            </Menu>
        </div>
    </div>
</div>

