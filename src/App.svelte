<script lang="ts">
    import Header from "./components/Header.svelte";
    import Search from "./components/Search.svelte";
    import AddChat from "./components/AddChat.svelte";
    import {MessageCardContainer, ChatCardContainer} from "./components/Card";
    import {onMount} from "svelte";
    import {applicationStore} from "./stores/applicationStore";
    import type {User} from "./interfaces/User";
    import Chat from "./components/Chat/Chat.svelte";
    import Call from "@components/Call/Call.svelte";

    let currentUser = {}
    let users = []
    let cards = []
    let chats = []
   /* onMount(async () => {
        const userSeed = $applicationStore.userSeederService.seed()
        users = userSeed.map((result: User) => {
            return {
                name: result.name.first + ' ' + result.name.last,
                email: result.email,
                phone: result.phone,
                avatar: result.picture.large
            }
        });
        cards = users.map((user: any) => {
            return {
                title: user.name,
                avatar: user.avatar
            }
        })
        currentUser = users.pop();
        chats = users.map((user: any) => {
            return {
                title: user.name,
                avatar: user.avatar,
                lastMessage: {
                    content: 'Hello',
                    time: '10:00'
                }
            }
        })
    });*/
</script>

<!--<main>;-->
<!--        <div class="flex justify-center t-6">-->
<!--            <Header bind:avatar={currentUser.avatar} bind:name={currentUser.name}/>-->
<!--        </div>-->
<!--        <div class="flex  search mt-4">-->
<!--            <div class="ml-auto">-->
<!--                <Search/>-->
<!--            </div>-->
<!--            <div class="ml-auto">-->
<!--                <AddChat/>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="mt-4 chat-card-container flex">-->
<!--            <ChatCardContainer {cards}/>-->
<!--        </div>-->
<!--        <div class="mt-4 message-card-container">-->
<!--            <MessageCardContainer {chats}/>-->
<!--        </div>-->
<!--</main>-->
<!--<div class="flex justify-center t-6">-->
<!--    <Header bind:avatar={currentUser.avatar} bind:name={currentUser.name}/>-->
<!--</div>-->
<main>
    <Call/>
    <Chat/>
</main>

<style>
    .chat-card-container {
        display: flex;
        flex-direction: column;
        padding: 10px;
        /*overflow-y:auto;*/
        width: 100%;
        height: 30%;
        /*get avaialble height*/
        /*flex-basis: 0;*/
        /*flex-grow: 1;*/
        /*height: calc(100vh - 200px);*/
    }
    .message-card-container {
        display: flex;
        flex-direction: column;
        padding: 10px;
        overflow-y:auto;
        width: 100%;
        height: 100%;
        /*get avaialble height*/
        /*flex-basis: 0;*/
        flex-grow: 1;
        /*height: calc(100vh - 200px);*/
    }

    .message-card-container::-webkit-scrollbar {
        display: none;
    }
    .search {
        display: flex;
    }


    main {
        display: flex;
        flex-direction: column;
        /*border-radius: 40px;*/
        background: #292F3F;
        box-shadow: 40px 40px 100px 5px rgba(24, 48, 63, 0.50);
        width: 100vw;
        height: 100vh;

        margin: 0 auto;
        padding: 0 20px;

    }




</style>
