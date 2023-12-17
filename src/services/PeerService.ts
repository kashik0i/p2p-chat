import {joinRoom, selfId} from 'trystero'
import type {Room, ActionSender, ActionReceiver, ActionProgress} from 'trystero'
import type {Message} from "@/interfaces/Message";
// import {EventEmitter} from "events";
import EventEmitter from 'eventemitter3'
import type {Writable} from "svelte/store";
import {get, writable} from "svelte/store";
import type {User} from "@/interfaces/User";
import {applicationStore} from "@stores/applicationStore";

interface Action<T> {
    send: ActionSender<T>
    receive: ActionReceiver<T>
    progress: ActionProgress
}

interface PeerEvents {
    join: (peerId: string) => void
    user: (user: User) => void

    leave: (peerId: string) => void
    stream: (stream: MediaStream, peerId: string) => void
    message: (message: Message) => void,
    file: (file: File,peerId:string,metadata:Message) => void,
    error: (error: Error) => void

    typing: (peerId: string) => void
    stoppedTyping: (peerId: string) => void
}

interface PeerActions {
    message: Action<Message>
    user: Action<User>
    file: Action<File>
    // stream: Action<MediaStream>
}

export class PeerService {
    selfId = selfId
    instance: Room
    actions: PeerActions;
    ee: EventEmitter<PeerEvents> = new EventEmitter<PeerEvents>()
    peers: Writable<Map<string, User>> = writable(new Map<string, User>())

    constructor() {
        const config = {
            appId: import.meta.env.VITE_APP_ID,
            rtcConfig: {
                iceServers: [
                    {"urls": "stun:stun.relay.metered.ca:80"},
                    {
                        "urls": "turn:a.relay.metered.ca:80",
                        "username": "7f6092c5939e54e19d54ce06",
                        "credential": "RumGyEc481RXhlDS"
                    },
                    {
                        "urls": "turn:a.relay.metered.ca:80?transport=tcp",
                        "username": "7f6092c5939e54e19d54ce06",
                        "credential": "RumGyEc481RXhlDS"
                    },
                    {
                        "urls": "turn:a.relay.metered.ca:443",
                        "username": "7f6092c5939e54e19d54ce06",
                        "credential": "RumGyEc481RXhlDS"
                    },
                    {
                        "urls": "turn:a.relay.metered.ca:443?transport=tcp",
                        "username": "7f6092c5939e54e19d54ce06",
                        "credential": "RumGyEc481RXhlDS"
                    }]
            }
        }
        if (import.meta.env.VITE_TRACKER_LIST!="") {
            config.trackerUrls = import.meta.env.VITE_TRACKER_LIST.split(',')
        }
        this.instance = joinRoom(config, "default")
        this.instance.onPeerJoin(async (peerId) => {
            console.log('peer joined', peerId)
            //send user info
            const currentUser = get(get(applicationStore).userService.user)
            await this.actions.user.send(currentUser)
            this.ee.emit('join', peerId)
            // this.peers.update((peers) => {
            //     peers.set(peerId, {} as User)
            //     return peers
            // })
        })
        this.instance.onPeerLeave((peer) => {
            console.log('peer left', peer)
            this.ee.emit('leave', peer)
            this.peers.update((peers) => {
                peers.delete(peer)
                return peers
            })
        })
        // this.instance.onPeerStream(
        //     (stream, peerId) => (peerElements[peerId].video.srcObject = stream)
        // )
        const message = this.instance.makeAction<Message>('message')
        const user = this.instance.makeAction<User>('user')
        const file = this.instance.makeAction<File>('file')

        this.actions = {
            message: {
                send: message[0],
                receive: message[1],
                progress: message[2]
            },
            user: {
                send: user[0],
                receive: user[1],
                progress: user[2]
            },
            file: {
                send: file[0],
                receive: file[1],
                progress: file[2]
            }
        }
        this.actions.message.receive((message) => {
            console.log('received message', message)
            this.ee.emit('message', message)
        });
        // @ts-ignore
        this.actions.file.receive((file,peerId,metadata:Message) => {
            console.log('received file', file)
            this.ee.emit('file', file,peerId,metadata)
        });
        this.actions.user.receive((user) => {
            console.log('received user', user)
            this.ee.emit('user', user)
            this.peers.update((peers) => {
                peers.set(user.id, user)
                return peers
            })
        });

    }


}