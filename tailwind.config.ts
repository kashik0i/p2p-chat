import type {Config} from 'tailwindcss';
import {getIconCollections, iconsPlugin} from "@egoist/tailwindcss-icons";
// import * as Scrollbar from 'tailwind-scrollbar';
export default {
    content: ["./index.html",
        './src/**/*.{html,js,svelte,ts}',
        'node_modules/preline/dist/*.js'
    ],

    theme: {

    },
    important: true, // <-- adding this line will give your Tailwind classes !important by default

    plugins: [
        require('preline/plugin'),
        require('tailwind-scrollbar')({ nocompatible: true }),
        iconsPlugin({
            collections: getIconCollections(["mdi", "lucide"]),
        }),
    ],
} satisfies Config;