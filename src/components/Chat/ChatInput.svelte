<script>
    import {ActionIcon} from "@svelteuidev/core";
    import EmojiSelector from 'svelte-emoji-selector';

    export let value = '';

    function onEmoji(event) {
        value += event.detail;
    }

    const handleToggleEmojiPicker = () => {
        console.log('toggle emoji picker');
    }
</script>
<div class="flex-grow ml-4">
    <div class="relative w-full">
        <input
                type="text"
                class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                on:keydown
                bind:value
        />
        <ActionIcon
                class="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
        >
            <!--            <svg-->
            <!--                    class="w-6 h-6"-->
            <!--                    fill="none"-->
            <!--                    stroke="currentColor"-->
            <!--                    viewBox="0 0 24 24"-->
            <!--                    xmlns="http://www.w3.org/2000/svg"-->
            <!--            >-->
            <!--                <path-->
            <!--                        stroke-linecap="round"-->
            <!--                        stroke-linejoin="round"-->
            <!--                        stroke-width="2"-->
            <!--                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"-->
            <!--                ></path>-->
            <!--            </svg>-->
            <EmojiSelector on:emoji={onEmoji}/>
        </ActionIcon>
    </div>
</div>