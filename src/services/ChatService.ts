import type {Message} from "@/interfaces/Message";
import type {Writable} from "svelte/store";
import {get, writable} from "svelte/store";
import type {User} from "@/interfaces/User";
import type {Chat} from "@/interfaces/Chat";
import {MessageTypeEnum} from "@/enums/MessageTypeEnum";
import demoVideo from "@assets/demo.mp4";
import demoAudio from "@assets/demo.mp3";
import demoImage from "@assets/svelte.svg";

export class ChatService {
    public conversations: Writable<Map<string, Chat>> = writable(new Map<string, Chat>())
    public currentConversationId: Writable<string | null> = writable<string | null>(null)
    public users = writable<User[]>([])

    constructor() {
        console.log('ChatService constructor')
        const messages = this.seedMessages()
        const globalChat: Chat = {
            id: import.meta.env.VITE_GLOBAL_CHAT_ID,
            messages: messages,
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
        console.log('addMessage', message)
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

    private seedMessages():Message[] {
        const audioFile = new File([''], 'audio.mp3', {type: 'audio/mp3'});
        const audioUrl = URL.createObjectURL(audioFile);

        const videoFile = new File([''], 'video.mp4', {type: 'video/mp4'});
        const videoUrl = URL.createObjectURL(videoFile);

        const imageFile = new File([''], 'image.png', {type: 'image/png'});
        const imageUrl = URL.createObjectURL(imageFile);

        const fileFile = new File([''], 'file.test', {type: 'application/octet-stream'});
        const fileUrl = URL.createObjectURL(fileFile);
        console.log(demoImage)
        return [
            {
                id: '1',
                senderId: '1',
                conversationId: import.meta.env.VITE_GLOBAL_CHAT_ID,
                content: 'Hello World',
                timestamp: new Date().getTime(),
                type:MessageTypeEnum.TEXT
            },
            {
                id: '2',
                senderId: '1',
                conversationId: import.meta.env.VITE_GLOBAL_CHAT_ID,
                content: demoAudio,
                timestamp: new Date().getTime(),
                type:MessageTypeEnum.AUDIO,
                metadata: {
                    name: 'audio.mp3',
                    size: 0,
                    type: 'audio/mp3',
                }
            },
            {
                id: '3',
                senderId: '1',
                conversationId: import.meta.env.VITE_GLOBAL_CHAT_ID,
                content: demoVideo,
                timestamp: new Date().getTime(),
                type:MessageTypeEnum.VIDEO,
                metadata: {
                    name: 'video.mp4',
                    size: 0,
                    type: 'video/mp4',
                }
            },
            {
                id: '4',
                senderId: '1',
                conversationId: import.meta.env.VITE_GLOBAL_CHAT_ID,
                content: demoImage,
                timestamp: new Date().getTime(),
                type:MessageTypeEnum.IMAGE,
                metadata: {
                    name: 'image.png',
                    size: 0,
                    type: 'image/png',
                }
            },
            {
                id: '5',
                senderId: '1',
                conversationId: import.meta.env.VITE_GLOBAL_CHAT_ID,
                content: fileUrl,
                timestamp: new Date().getTime(),
                type:MessageTypeEnum.FILE,
                metadata: {
                    name: 'file.test',
                    size: 0,
                    type: 'application/octet-stream',
                }
            }

        ]
    }
}