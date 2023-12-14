<script lang="ts">
    import Avatar from "../../Avatar.svelte";

    export let chat;
</script>


<div class="chat">
    <Avatar avatar={chat.avatar} />
    <div class="ml-3">
        <div class="title">{chat.title}</div>
        <div class="lastMessage">{chat.lastMessage.content}</div>
    </div>
    <div class="ml-auto">
        <div class="lastMessage">{chat.lastMessage.time}</div>
    </div>
</div>



<style>
    .chat {
        display: flex;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #e6e6e6;
        cursor: pointer;
        transition: all 0.2s ease-in-out;


    }

    /*.chat:hover {*/
    /*    background-color: #e6e6e6;*/
    /*}*/

   .title{
       color: #FFF;

       font-family: Roboto,serif;
       font-size: 15px;
       font-style: normal;
       font-weight: 400;
       line-height: normal;
       letter-spacing: 1px;
       text-transform: capitalize;
   }

   .lastMessage{
       color: #FFF;
       font-family: Roboto;
       font-size: 13px;
       font-style: normal;
       font-weight: 300;
       line-height: normal;
       letter-spacing: 1px;
   }
</style>