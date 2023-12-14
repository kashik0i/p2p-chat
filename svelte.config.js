import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

import { preprocessMeltUI } from '@melt-ui/pp'
import sequence from 'svelte-sequential-preprocessor'

const config = {
  preprocess: sequence([
    vitePreprocess(),
    preprocessMeltUI()
  ])
}

export default config