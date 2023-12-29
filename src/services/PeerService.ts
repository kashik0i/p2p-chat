import {joinRoom, selfId} from 'trystero'
import type {Room} from 'trystero'
import type {Message} from "@/interfaces/Message";
import EventEmitter from 'eventemitter3'
import type {User} from "@/interfaces/User";
import type {PeerActions, PeerEvent} from "@/interfaces/Trystero";
import type {CallData, PeerCall} from "@/interfaces/CallService";
import type {CallRequest} from "@/interfaces/CallService/CallRequest";


export class PeerService {
    selfId = selfId
    instance: Room
    actions: PeerActions;
    ee: EventEmitter<PeerEvent, this> = new EventEmitter<PeerEvent, this>()

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
            },
            trackerUrls: import.meta.env?.VITE_TRACKER_LIST?.split(',')
        }
        this.instance = joinRoom(config, "default")

        this.instance.onPeerJoin(async (peerId) => {
            console.log('peer joined', peerId)
            this.ee.emit('join', peerId)
        })
        this.instance.onPeerLeave((peer) => {
            console.log('peer left', peer)
            this.ee.emit('leave', peer)
        })
        this.instance.onPeerStream((stream, peerId, metadata) => {
            // @ts-ignore
            this.ee.emit('stream', stream, peerId, metadata)
        })
        this.instance.onPeerTrack((track,stream, peerId) => {
            this.ee.emit('track', track, stream, peerId)
        })

        const message = this.instance.makeAction<Message>('message')
        const user = this.instance.makeAction<User>('user')
        const file = this.instance.makeAction<Uint8Array>('file')
        const call = this.instance.makeAction<CallRequest>('call')
        const callData = this.instance.makeAction<CallData>('callData')


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
            },
            call: {
                send: call[0],
                receive: call[1],
                progress: call[2]
            },
            callData: {
                send: callData[0],
                receive: callData[1],
                progress: callData[2]
            },
        }
        this.actions.message.receive((message) => {
            console.log('received message', message)
            this.ee.emit('message', message)
        });
        // @ts-ignore
        this.actions.file.receive((file, peerId, metadata: Message) => {
            console.log('received file', file)
            this.ee.emit('file', file, peerId, metadata)
        });
        this.actions.user.receive((user) => {
            console.log('received user', user)
            this.ee.emit('user', user)
        });
        this.actions.call.receive((call) => {
            console.log('received call', call)
            this.ee.emit('call', call)
        });
        this.actions.callData.receive((callData, peerId) => {
            console.log('received callData', callData)
            this.ee.emit('callData', callData, peerId)
        });

    }


}