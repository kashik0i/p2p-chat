import {joinRoom, selfId} from 'trystero'
import type {Room, ActionSender, ActionReceiver, ActionProgress} from 'trystero'
import type {Message} from "@/interfaces/Message";
// import {EventEmitter} from "events";
import EventEmitter from 'eventemitter3'

interface Action<T>{
    send: ActionSender<T>
    receive: ActionReceiver<T>
    progress: ActionProgress
}
interface PeerEvents {
    join: (peerId: string) => void
    leave: (peerId: string) => void
    stream: (stream: MediaStream, peerId: string) => void
    message: (message: Message) => void,
    error: (error: Error) => void
}

interface PeerActions {
    message: Action<Message>
    // stream: Action<MediaStream>
}

export class PeerService{
    selfId = selfId
    instance: Room
    actions:PeerActions;
    ee:EventEmitter<PeerEvents> = new EventEmitter<PeerEvents>()
    peers: string[] = []

    constructor() {
        const config = {appId: 'san_narciso_3d'}
        this.instance = joinRoom(config, import.meta.env.VITE_APP_ID)
        this.instance.onPeerJoin((peer) => {
            console.log('peer joined', peer)
            this.ee.emit('join', peer)
            this.peers.push(peer)
        })
        this.instance.onPeerLeave((peer) => {
            console.log('peer left', peer)
            this.ee.emit('leave', peer)
            this.peers = this.peers.filter((p) => p !== peer)
        })
        // this.instance.onPeerStream(
        //     (stream, peerId) => (peerElements[peerId].video.srcObject = stream)
        // )
        let [send, receive,progress] = this.instance.makeAction<Message>('message')
        receive((message) => {
            console.log('received message', message)
            this.ee.emit('message', message)
        })
        this.actions = {
            message: {
                send,
                receive,
                progress
            }
        }

    }


}