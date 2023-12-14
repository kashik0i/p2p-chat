<script lang="ts">
    import {createAvatar, melt} from '@melt-ui/svelte';

    export let avatar = 'https://avatars.githubusercontent.com/u/0';
    const {
        elements: {image, fallback},
    } = createAvatar({
        src:avatar,
    });

</script>


<div
        class="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100"
>
    <img
            use:melt={$image}
            alt="Avatar"
            class="h-full w-full rounded-[inherit]"
    />
    <span use:melt={$fallback} class="text-3xl font-medium text-magnum-700">RH</span>
</div>