import type {Message} from "@/interfaces/Message";
import type {Writable} from "svelte/store";
import {get, writable} from "svelte/store";
import type {User} from "@/interfaces/User";

export class ChatService {
    public messages: Writable<Message[]> = writable<Message[]>([])
    public users = writable<User[]>([])

    constructor() {
        console.log('ChatService constructor')
    }

    getUserByPeerId(sender: string) {
        return get(this.users).find(user => user.peerId === sender);
    }
}