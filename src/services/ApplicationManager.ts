import {CallService} from "./CallService";
import {ChatService} from "./ChatService";
import {PeerService} from "./PeerService";
import {UserService} from "./UserService";
import {UserSeederService} from "./UserSeederService";
import {get} from "svelte/store";
import {type ColorScheme, colorScheme} from "@svelteuidev/core";
import type {Message} from "@/interfaces/Message";
import {guid} from "@/utils";
import {MessageTypeEnum} from "@/enums/MessageTypeEnum";

export class ApplicationManager {
    callService: CallService;
    chatService: ChatService;
    peerService: PeerService;
    userService: UserService;
    theme = colorScheme
    userSeederService: UserSeederService = new UserSeederService()

    constructor() {
        this.userService = new UserService()
        this.peerService = new PeerService()
        this.chatService = new ChatService()
        this.callService = new CallService(get(this.userService.user))
        console.log('ApplicationManager constructor')
        this.userService.user.update((user) => {
            user.peerId = this.peerService.selfId
            console.log('user', user)
            return user
        });
        // this.userSeederService.seed()
        this.peerService.ee.on('message', (message) => {
            console.log('received message', message)
            this.chatService.conversations.update((conversations) => {
                if (!message.conversationId) return conversations;
                const conversation = conversations.get(message.conversationId)
                if (conversation) {
                    conversation.messages.push(message)
                }
                console.log(conversations)
                return conversations
            })
        })
        this.peerService.ee.on('user', (user) => {
            console.log('received user', user)
            this.chatService.users.update((users) => {
                users.push(user)
                return users
            })
            this.chatService.conversations.update(conversations=>{
                const globalConversation = conversations.get(import.meta.env.VITE_GLOBAL_CHAT_ID)
                globalConversation?.users.set(user.id.toString(),user)
                return conversations;
            })
        });
        // @ts-ignore
        this.peerService.ee.on('file',(data:Uint8Array,peerId,message)=>{
            console.log('received file', data,peerId,message)
            const file = new File([data], message.metadata.name, {type: message.metadata.type});
            message.content = URL.createObjectURL(file)
            this.chatService.addMessage(message)
        })
        //TODO onLeave remove user from users and conversations

        // this.peerService.ee.on('call', (call) => {
        //     console.log('received call', call)
        //     this.callService.call.set(call)
        // })
        const theme = localStorage.getItem('theme') as ColorScheme | undefined
        if (theme) {
            this.theme.set(theme)
        }
        this.theme.subscribe((value) => {
            localStorage.setItem('theme', value)
        })
    }

    async send(value: string, conversationId: string) {
        console.log("conversationId", conversationId)
        const user = get(this?.userService?.user)
        if (!user) {
            throw new Error('user not found')
        }
        console.log('sending message', user)
        const message = {
            id: guid(),
            content: value,
            senderId: user.id.toString(),
            conversationId,
            timestamp: Date.now(),
            type: MessageTypeEnum.TEXT
        } as Message;
        //TODO: send to conversationId users
        const users = this.chatService.getUsersByConversationId(conversationId)?.values()
        const peerIds = users ? Array.from(users).map(user => user.peerId) : []
        await this?.peerService?.actions.message.send(message,peerIds)
        this.chatService.addMessage(message)
    }

    async broadcast(value: string) {
        const user = get(this?.userService?.user)
        if (!user) {
            throw new Error('user not found')
        }
        console.log('sending message', user)
        const message :Message = {
            id: guid(),
            content: value,
            senderId: user.id.toString(),
            timestamp: Date.now(),
            type:MessageTypeEnum.FILE
        };
        await this?.peerService?.actions.message.send(message)
        this.chatService.addMessage(message)
    }

    getUserById(sender: string) {
        const currentUser = get(this.userService.user)
        if (currentUser.id.toString() === sender) {
            return currentUser
        }
        return this.chatService.getUserById(sender)
    }

    async joinCall(conversationId: string) {

    }

    async sendFile(file: File,type:MessageTypeEnum, conversationId: string) {
        const user = get(this?.userService?.user)
        if (!user) {
            throw new Error('user not found')
        }
        const message: Message = {
            id: guid(),
            content: "",
            senderId: user.id.toString(),
            timestamp: Date.now(),
            conversationId,
            type: type,
            metadata: {
                name: file.name,
                size: file.size,
                type: file.type
            }
        };
        console.log('sending message', file)
        // //TODO: send to conversationId users
        const users = this.chatService.getUsersByConversationId(conversationId)?.values()
        const peerIds = users ? Array.from(users).map(user => user.peerId) : []
        // @ts-ignore
        await this?.peerService?.actions.file.send(file, peerIds, message)
        message.content = URL.createObjectURL(file)
        this.chatService.addMessage(message)
    }
}

