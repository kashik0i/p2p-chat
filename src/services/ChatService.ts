import type {Message} from "@/interfaces/Message";
import type {Writable} from "svelte/store";
import {writable} from "svelte/store";

export class ChatService {
    messages: Writable<Message[]> = writable<Message[]>([])

    constructor() {
        console.log('ChatService constructor')
    }
}