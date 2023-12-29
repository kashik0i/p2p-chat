<script lang="ts">
    import {
        colorScheme, Container, Flex,
        Footer,
        Header, Menu,
        Navbar,
        Tabs
    } from "@svelteuidev/core";
    import {applicationStore} from "@stores/applicationStore";
    import Call from "@components/Call/Call.svelte";
    import CallSideMenu from "@components/Call/CallSideMenu.svelte";


    let opened = false;

    function toggleTheme() {
        colorScheme.update((v) => (v === 'light' ? 'dark' : 'light'));
    }

    function toggleAside() {
        opened = !opened;
    }
</script>

<div class="flex flex-col w-full h-full antialiased text-gray-800">
    <div class="flex flex-row h-full w-full">
<!--        <CallSideMenu/>-->
        <Call/>
    </div>
</div>





