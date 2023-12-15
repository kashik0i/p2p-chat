import {CallService} from "./CallService";
import {ChatService} from "./ChatService";
import {PeerService} from "./PeerService";
import {UserService} from "./UserService";
import {UserSeederService} from "./UserSeederService";
import {get} from "svelte/store";

export class ApplicationManager {
    callService: CallService = new CallService()
    chatService: ChatService = new ChatService()
    peerService: PeerService = new PeerService()
    userService: UserService = new UserService()
    userSeederService: UserSeederService = new UserSeederService()

    constructor() {
        console.log('ApplicationManager constructor')
        this.userService.user.update((user) => {
            user.peerId = this.peerService.selfId
            return user
        });
        // this.userSeederService.seed()
        this.peerService.ee.on('message', (message) => {
            console.log('received message', message)
            this.chatService.messages.update((messages) => {
                messages.push(message)
                return messages
            })
        })
    }

    async send(value: string) {
        const user = get(this?.userService?.user)
        if (!user) {
            throw new Error('user not found')
        }
        console.log('sending message', user)
        const message = {
            id: Math.random().toString(36).substring(7),
            content: value,
            sender: user,
            timestamp: Date.now()
        };
        await this?.peerService?.actions.message.send(message)
        this.chatService.messages.update((messages) => {
            messages.push(message)
            return messages
        })
    }
}