<script lang="ts">
    import {Image} from '@svelteuidev/core';

    export let src = 'https://avatars.githubusercontent.com/u/1';
    export let radius = 'md';
</script>
<Image {radius} {src}  class="w-fit h-fit"/>
