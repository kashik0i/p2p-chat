// import Peer from "peerjs";
// import {CallStateEnum} from "@/enums/CallStateEnum";
// import type {PeerCall} from "@/interfaces/CallService";
// import {get, type Writable, writable} from "svelte/store";
// import type {User} from "@/interfaces/User";
// import type {MediaStreamInfo} from "@/interfaces/MediaStreamInfo";
//
// export class PeerJsService {
//     instance: Writable<PeerCall> = writable()
//
//     constructor(user: User) {
//         const peer = new Peer(user.id, {
//             // debug: 3,
//             // host: 'localhost',
//             // port: 9000,
//             // path: '/peerjs',
//             config: {
//                 iceServers: [
//                     {"urls": "stun:stun.relay.metered.ca:80"},
//                     {
//                         "urls": "turn:a.relay.metered.ca:80",
//                         "username": "7f6092c5939e54e19d54ce06",
//                         "credential": "RumGyEc481RXhlDS"
//                     },
//                     {
//                         "urls": "turn:a.relay.metered.ca:80?transport=tcp",
//                         "username": "7f6092c5939e54e19d54ce06",
//                         "credential": "RumGyEc481RXhlDS"
//                     },
//                     {
//                         "urls": "turn:a.relay.metered.ca:443",
//                         "username": "7f6092c5939e54e19d54ce06",
//                         "credential": "RumGyEc481RXhlDS"
//                     },
//                     {
//                         "urls": "turn:a.relay.metered.ca:443?transport=tcp",
//                         "username": "7f6092c5939e54e19d54ce06",
//                         "credential": "RumGyEc481RXhlDS"
//                     }
//                 ]
//             }
//         })
//         peer.on('open', (id) => {
//             console.log('My peer ID is: ' + id);
//         })
//         peer.on('connection', (conn) => {
//             conn.on('data', (data) => {
//                 // Will print 'hi!'
//                 console.log(data);
//             });
//         })
//         peer.on('call', async (call) => {
//             console.log('received call', call)
//             this.instance.update((value) => {
//                 value.call = call
//                 value.state = CallStateEnum.Incoming
//                 return value
//             });
//
//             //TODO ask user to accept call and send ringing state
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 audio: true,
//                 video: true
//             })
//             call.answer(stream)
//             this.instance.update((value) => {
//                 value.localMediaStream.push({
//                     stream,
//                     type: 'camera',
//                     userId: user.id,
//                 })
//                 value.state = CallStateEnum.Answered
//                 return value
//             });
//             call.on('stream', (stream) => {
//                 console.log('got stream')
//                 const streamInfo: MediaStreamInfo = {
//                     stream,
//                     userId: call.peer,
//                     type: 'camera',
//                 }
//                 this.handleStream(streamInfo)
//             })
//             call.on('close', () => {
//                 console.log('call closed')
//                 this.endCall()
//             })
//         })
//         this.instance.set({
//             peerConnection: peer,
//             call: null,
//             state: CallStateEnum.Idle,
//             isMuted: true,
//             isCameraOff: true,
//             isScreenSharing: true,
//             participants: [],
//             RoomId: undefined,
//             localMediaStream: [],
//             remoteMediaStream: new Map<string, MediaStreamInfo[]>(),
//         })
//
//     }
//
//     async callUser(userId: string) {
//         const instance = get(this.instance)
//
//         if (instance.peerConnection === null) {
//             throw new Error('Peer instance is null')
//         }
//         const mediaStream = await navigator.mediaDevices.getUserMedia({
//             video: true,
//             audio: true,
//         })
//         // if (instance.isMuted) {
//         //     mediaStream.getAudioTracks().forEach((track) => {
//         //         track.enabled = false
//         //     })
//         // }
//         // if (instance.isCameraOff) {
//         //     mediaStream.getVideoTracks().forEach((track) => {
//         //         track.enabled = false
//         //     })
//         // }
//
//         const peerCall = instance.peerConnection.call(userId, mediaStream, {
//             metadata: {
//                 userId: instance.peerConnection.id,
//                 //TODO add roomId, conversationId, avatar
//             }
//         })
//
//         peerCall.on('stream', (stream) => {
//             console.log('got stream', stream, userId)
//             const streamInfo: MediaStreamInfo = {
//                 stream,
//                 userId,
//                 type: 'camera',
//             }
//             this.handleStream(streamInfo)
//         })
//         const streamInfo: MediaStreamInfo = {
//             stream: mediaStream,
//             userId: instance.peerConnection.id,
//             type: 'camera',
//         }
//         this.instance.update((call) => {
//             call = {
//                 ...call,
//                 call: peerCall,
//                 localMediaStream: [streamInfo],
//                 state: CallStateEnum.Outgoing,
//                 participants: [userId],
//             }
//
//             return call
//         });
//     }
//
//     handleStream(streamInfo: MediaStreamInfo) {
//         const userId = streamInfo.userId
//         this.instance.update((call) => {
//             // call.localMediaStream.push(streamInfo)
//             call.remoteMediaStream.set(userId, [streamInfo])
//             return call;
//             if (call.remoteMediaStream.has(userId)) {
//                 call.remoteMediaStream.get(userId)?.push(streamInfo)
//             } else {
//                 call.remoteMediaStream.set(userId, [streamInfo])
//             }
//             return call
//         });
//     }
//
//     toggleMute() {
//         this.instance.update((instance) => {
//             instance.isMuted = !instance.isMuted
//             instance.localMediaStream.forEach((streamInfo) => {
//                 streamInfo.stream.getAudioTracks().forEach((track) => {
//                     track.enabled = !track.enabled
//                 })
//             })
//             return instance
//         });
//
//     }
//
//     toggleCamera() {
//         this.instance.update((value) => {
//             value.isCameraOff = !value.isCameraOff
//             value.localMediaStream.forEach((streamInfo) => {
//                 streamInfo.stream.getVideoTracks().forEach((track) => {
//                     track.enabled = !track.enabled
//                 })
//             })
//             return value
//         });
//     }
//
//     toggleScreenSharing() {
//         this.instance.update((value) => {
//             value.isScreenSharing = !value.isScreenSharing
//             return value
//         });
//     }
//
//     async toggleCall(calleeId: string) {
//         const instance = get(this.instance)
//         if (instance.call) {
//             instance.call.close()
//             instance.state = CallStateEnum.Idle
//             return
//         }
//         if (instance.state !== CallStateEnum.Idle) {
//             alert('You are already in a call')
//         }
//         if (!calleeId) {
//             alert('Please select a user')
//             return
//         }
//         await this.callUser(calleeId)
//     }
//
//     endCall() {
//         this.instance.update((value) => {
//             value?.call?.close()
//
//             value.call = null
//             value.state = CallStateEnum.Idle
//             //TODO release local and remote streams
//             value.localMediaStream.forEach((streamInfo) => {
//                 streamInfo.stream.getTracks().forEach((track) => {
//                     track.stop()
//                 })
//             })
//             value.localMediaStream = []
//             value.remoteMediaStream = new Map<string, MediaStreamInfo[]>()
//             value.participants = []
//             value.RoomId = undefined
//             value.isMuted = true
//             value.isCameraOff = true
//             value.isScreenSharing = false
//
//             return value
//         });
//     }
//
//     async toggleScreenShare() {
//         const instance = get(this.instance)
//         if (!instance.call) {
//             alert('You are not in a call')
//             return
//         }
//         if (!instance.isScreenSharing) {
//             const stream = await navigator.mediaDevices.getDisplayMedia({
//                 video: true,
//             })
//             this.instance.update((call) => {
//                 call.localMediaStream.push({
//                     stream,
//                     type: 'screen',
//                     userId: call.peerConnection?.id,
//                 })
//                 call.isScreenSharing = !call.isScreenSharing
//                 return call
//             });
//             return
//         }
//         this.instance.update((call) => {
//             const streamInfo = call.localMediaStream.find((streamInfo) => streamInfo.type === 'screen')
//             streamInfo?.stream.getTracks().forEach((track) => {
//                 track.stop()
//             })
//             return call
//         });
//
//
//     }
// }