/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_ID: string
    readonly VITE_TRACKER_LIST: string
    readonly VITE_GLOBAL_CHAT_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}