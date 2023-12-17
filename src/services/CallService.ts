import Peer from "peerjs";
import {CallStateEnum} from "@/enums/CallStateEnum";
import type {PeerCall} from "@/interfaces/PeerCall";
import {get, type Writable, writable} from "svelte/store";
import type {User} from "@/interfaces/User";

export class CallService {
    instance: Writable<PeerCall> = writable()

    constructor(user: User) {
        const peer = new Peer(user.id, {
            debug: 3,
            // host: 'localhost',
            // port: 9000,
            // path: '/peerjs',
            config: {
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
                    }
                ]
            }
        })
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        })
        peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                // Will print 'hi!'
                console.log(data);
            });
        })
        peer.on('call', async (call) => {
            console.log('received call', call)
            this.instance.update((value) => {
                value.call = call
                value.state = CallStateEnum.Incoming
                return value
            });

            //TODO ask user to accept call and send ringing state
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            })
            call.answer(stream)
            this.instance.update((value) => {
                value.localMediaStream.push({
                    stream,
                })
                value.state = CallStateEnum.Answered
                return value
            });
            call.on('stream', (stream) => {
                console.log('got stream')
                this.instance.update((value) => {
                    if (value.remoteMediaStream.find((s) => s.stream.id === stream.id && s.userId === call.peer)) {
                        return value
                    }
                    value.remoteMediaStream.push({
                        stream,
                        userId: call.peer,
                    })
                    return value
                });
            })
            call.on('close', () => {
                console.log('call closed')
                this.instance.update((value) => {
                    value.call = null
                    value.state = CallStateEnum.Idle
                    //TODO release local and remote streams
                    value.localMediaStream.forEach((streamInfo) => {
                        streamInfo.stream.getTracks().forEach((track) => {
                            track.stop()
                        })
                    })
                    value.localMediaStream = []
                    value.remoteMediaStream = []
                    value.participants = []
                    value.RoomId = undefined
                    value.isMuted = true
                    value.isCameraOff = true
                    value.isScreenSharing = false

                    return value
                });
            })
        })
        this.instance.set({
            peerConnection: peer,
            call: null,
            state: CallStateEnum.Idle,
            isMuted: true,
            isCameraOff: true,
            isScreenSharing: true,
            participants: [],
            RoomId: undefined,
            localMediaStream: [],
            remoteMediaStream: []
        })

    }

    async callUser(userId: string) {
        const instance = get(this.instance)

        if (instance.peerConnection === null) {
            throw new Error('Peer instance is null')
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })
        // if (instance.isMuted){
        //     mediaStream.getAudioTracks().forEach((track)=>{
        //         track.enabled = false
        //     })
        // }
        // if (instance.isCameraOff){
        //     mediaStream.getVideoTracks().forEach((track)=>{
        //         track.enabled = false
        //     })
        // }

        const peerCall = instance.peerConnection.call(userId, mediaStream, {
            metadata: {
                userId: instance.peerConnection.id,
                //TODO add roomId, conversationId, avatar
            }
        })
        peerCall.on('stream', (stream) => {
            console.log('got stream', stream, userId)
            this.instance.update((value) => {
                if (value.remoteMediaStream.find((s) => s.stream.id === stream.id && s.userId === call.peer)) {
                    return value
                }
                value.remoteMediaStream.push({
                    stream,
                    userId,
                })
                return value
            });
        })

        this.instance.update((value) => {
            value = {
                ...value,
                call: peerCall,
                localMediaStream: [{
                    stream: mediaStream,
                    userId: value?.peerConnection?.id,
                }],
                state: CallStateEnum.Outgoing,
                participants: [userId],
            }

            return value
        });
    }

    toggleMute() {
        this.instance.update((value) => {
            value.isMuted = !value.isMuted
            return value
        });
    }

    toggleCamera() {
        this.instance.update((value) => {
            value.isCameraOff = !value.isCameraOff
            return value
        });
    }

    toggleScreenSharing() {
        this.instance.update((value) => {
            value.isScreenSharing = !value.isScreenSharing
            return value
        });
    }
}