import type {Message} from "@/interfaces/Message";
import type {Writable} from "svelte/store";
import {get, writable} from "svelte/store";
import type {User} from "@/interfaces/User";
import type {Chat} from "@/interfaces/Chat";
import {generateAvatar} from "@/utils";

export class ChatService {
    public conversations: Writable<Map<string, Chat>> = writable(new Map<string, Chat>())
    public currentConversationId: Writable<string | null> = writable<string | null>(null)
    public users = writable<User[]>([])

    constructor() {
        console.log('ChatService constructor')
        const globalChat: Chat = {
            id: import.meta.env.VITE_GLOBAL_CHAT_ID,
            messages: [],
            users: new Map<string, User>(),
            avatar: '',
            name: 'Global Chat'
        }
        this.conversations.update(conversations => conversations.set(globalChat.id, globalChat));
        this.currentConversationId = writable(globalChat.id);
    }

    getUserById(sender: string) {
        return get(this.users).find(user => user.id.toString() === sender);
    }

    selectConversation(index: string | null) {
        this.currentConversationId.set(index)
    }

    addMessage(message: Message) {
        const conversationId = message.conversationId
        if (conversationId === "" || conversationId === undefined) return;
        this.conversations.update(conversations => {
            const conversation = conversations.get(conversationId);
            if (conversation === null || conversation === undefined) {
                console.log("conversation doesn't exist")
                return conversations;
            }
            conversation.messages.push(message)
            return conversations;
        })
    }

    getUsersByConversationId(id: string) {
        const conversation = get(this.conversations).get(id)
        if (conversation === undefined) return;
        return [...conversation.users.values()]
    }
}