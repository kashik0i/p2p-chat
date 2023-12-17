<script lang="ts">
import Avatar from "@components/Avatar.svelte";
import Message from "@components/Chat/Message/Message.svelte";
export let avatar = "";
export let message:Message;
</script>

<div class="col-start-1 col-end-8 p-3 rounded-lg">
    <div class="flex flex-row items-center">
        <div
                class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
        >
            <Avatar bind:src={avatar} radius="xl" slot="avatar"/>
        </div>
        <div
                class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
        >
            <div>
                <span class="text-gray-600 text-xs">{message.content}</span>
            </div>
        </div>
    </div>
</div>
