<script lang="ts">
    import Avatar from "../../Avatar.svelte";
    import {randomGradiant} from "../../../utils";

    export let title: string = 'Hello World!';
    export let avatar: string = '';

    let background = randomGradiant();
</script>

<div class="card p-8 ml-4 mr-4" style="background: {background}">
    <Avatar bind:avatar/>
    <h1>{title}</h1>
</div>

<style>
    .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        margin: 0 10px;
        cursor: pointer;
        border-radius: 30px;
        box-shadow: 20px 24px 34px 0 rgba(0, 0, 0, 0.45);
    }

    .card:hover {
        transform: scale(1.05);
        transition: transform 0.2s ease-in-out;
    }

/* if mobile media remove box and title */
    @media (max-width: 768px) {
        .card {
            /*box-shadow: none;*/
            /*border-radius: 0;*/

        }
        h1 {
            display: none;
        }

    }
</style>