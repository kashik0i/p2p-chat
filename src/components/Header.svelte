<script lang="ts">
    import Avatar from "./Avatar.svelte";

    export let name: string;
    export let avatar: string
</script>
<div class="flex items-center">
    <Avatar bind:src={avatar} alt="avatar" radius="xl"/>
    <div>{name}</div>
</div>

<style>

</style>