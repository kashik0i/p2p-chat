import {get, writable, type Writable} from "svelte/store";
import {CallStateEnum} from "@/enums/CallStateEnum";
import {guid} from "@/utils";
import type {User} from "@/interfaces/User";
import type {PeerCall} from "@/interfaces/CallService";
import type {MediaStreamInfo} from "@/interfaces/MediaStreamInfo";
import type {CallParticipant} from "@/interfaces/CallService/CallParticipant";
import type {CallRequest} from "@/interfaces/CallService/CallRequest";
import EventEmitter from "eventemitter3";

export interface CallEvent {
    streamAdded: (stream: MediaStreamInfo) => void
    streamRemoved: (stream: MediaStreamInfo) => void
    trackAdded: (track: MediaStreamTrack, stream: MediaStream) => void
    trackRemoved: (track: MediaStreamTrack, stream: MediaStream) => void
}


export class CallService {
    currentCall: Writable<PeerCall | null> = writable(null)
    ee: EventEmitter<CallEvent, this> = new EventEmitter<CallEvent, this>()
    callLog = writable<PeerCall[]>()
    layout: any;
    volume: Writable<number> = writable(100)

    constructor() {
        console.log('CallService constructor')
        this.init()
        this.currentCall.subscribe((call) => {
            if (!call) {
                localStorage.setItem('currentCall', JSON.stringify(null))
                return
            }
            const participants = get(call?.participants)
            localStorage.setItem('currentCall', JSON.stringify({
                ...call,
                participants: participants.map(participant => ({
                    ...participant,
                    stream: [],
                }))
            }))
        })
        // this.callLog.subscribe((callLog) => {
        //     localStorage.setItem('callLog', JSON.stringify(callLog))
        // })

    }

    updateParticipantState(state: CallStateEnum, userId: string) {
        console.log('updateParticipantState', state, userId)
        this.currentCall.update((call) => {
            if (!call) {
                return call
            }
            call.participants.update((participants) => {
                const participant = participants.find(participant => participant.id === userId)
                if (!participant) {
                    return participants
                }
                participant.status = state
                return participants
            })
            return call
        })
    }

    endCall() {
        this.currentCall.update(call => {
            call?.participants.update(participants => {
                participants.forEach(participant => {
                    participant.stream.forEach(({stream}) => {
                        stream.getTracks().forEach(track => {
                            track.stop()
                        })
                    })
                })
                return []
            })
            return null
        })

    }

    dropUserFromCall(senderId: string) {
        console.log('dropUserFromCall', senderId)
        this.currentCall.update((call) => {
            if (!call) {
                return call
            }
            call.participants.update((participants) => {
                const participant = participants.find(participant => participant.id === senderId)
                if (!participant) {
                    return participants
                }
                participant.stream.forEach(({stream}) => {
                    stream.getTracks().forEach(track => {
                        track.stop()
                    })
                })
                return participants.filter(participant => participant.id !== senderId)
            })
            return call
        })
    }

    async createCall(currentUser: User, participants: User[], conversationId: string = "", isGroupCall: boolean = false) {
        // const currentCallLog = get(this.callLog)

        this.currentCall.update((currentCall) => {
            if (currentCall) {
                throw new Error('Call already exists')
            }
            return {
                id: guid(),
                callerId: currentUser.id,
                participants: writable(participants.map(participant => ({
                    id: participant.id,
                    //TODO ringing is not correct status, change to idle
                    status: participant.id === currentUser.id && isGroupCall ? CallStateEnum.Answered : CallStateEnum.Ringing,
                    peerId: participant.peerId,
                    stream: [],
                    isMuted: true,
                    isCameraOff: true,
                    isScreenSharing: false,
                }))) as Writable<CallParticipant[]>,
                state: isGroupCall ? CallStateEnum.Answered : CallStateEnum.Outgoing,
                metadata: {
                    conversationId: conversationId,
                    avatar: currentUser.avatar,
                },
            } as PeerCall
        })
    }

    startCall() {
        //TODO add call to call log
        this.currentCall.update((call) => {
            if (!call) {
                return call
            }
            call.state = CallStateEnum.Answered
            return call
        })
    }

    private init() {
        this.currentCall.update((call) => {
            const currentCall = localStorage.getItem('currentCall')
            if (!currentCall) {
                return null
            }
            const callFromStorage = JSON.parse(currentCall)
            if (!callFromStorage) {
                return null
            }
            return {
                ...callFromStorage,
                participants: writable(callFromStorage.participants),
            } as PeerCall
        })
    }

    getUserStream(id: string) {
        const currentCall = get(this.currentCall)
        if (!currentCall) {
            return undefined
        }
        return get(currentCall.participants).find(participant => participant.id === id)?.stream
    }

    createCallRequest(call: PeerCall) {
        const participants = get(call.participants)
        return {
            id: call.id,
            callerId: call.callerId,
            participants: participants,
            metadata: call.metadata,
        } as CallRequest

    }

    getParticipants() {
        const currentCall = get(this.currentCall)
        if (!currentCall) {
            return []
        }
        return get(currentCall.participants)
    }

    addStreamToParticipant(userId: string, stream: MediaStreamInfo) {
        this.currentCall.update((call) => {
            if (!call) {
                return call
            }
            call.participants.update((participants) => {
                const participant = participants.find(participant => participant.id === userId)
                if (!participant) {
                    return participants
                }
                participant.stream.push(stream)
                return participants
            })
            return call
        })
    }

    removeStreamFromParticipant(userId: string, streamInfo: MediaStreamInfo) {
        this.currentCall.update((call) => {
            if (!call) {
                return call
            }
            call.participants.update((participants) => {
                const participant = participants.find(participant => participant.id === userId)
                if (!participant) {
                    return participants
                }
                participant.stream = participant.stream.filter(stream => stream.type !== streamInfo.type)
                return participants
            })
            return call
        })
    }

    addTrackToParticipantStream(userId: string, mediaStream: MediaStream, track: MediaStreamTrack) {
        this.currentCall.update((call) => {
            if (!call) {
                return call
            }
            call.participants.update((participants) => {
                const participant = participants.find(participant => participant.id === userId)
                if (!participant) {
                    return participants
                }
                const stream = participant.stream.find(({stream}) => stream.id === mediaStream.id)
                if (!stream) {
                    console.info('stream not found')
                    return participants
                }
                stream.stream.addTrack(track)
                return participants
            })
            return call
        })
    }

    removeTrackFromParticipantStream(userId: string, streamInfo: MediaStreamInfo, track: MediaStreamTrack) {
        this.currentCall.update((call) => {
            if (!call) {
                return call
            }
            call.participants.update((participants) => {
                const participant = participants.find(participant => participant.id === userId)
                if (!participant) {
                    return participants
                }
                const stream = participant.stream.find(stream => stream.type === streamInfo.type)
                if (!stream) {
                    return participants
                }
                stream.stream.removeTrack(track)
                return participants
            })
            return call
        })
    }


    async toggleVoice(user: User, isCurrentUser: boolean = false) {
        const currentCall = get(this.currentCall)
        if (!currentCall) {
            return
        }
        const participants = get(currentCall.participants)
        const participant = participants.find(participant => participant.id === user.id)
        if (!participant) {
            return
        }
        let streamInfo = participant.stream.find(stream => stream.type === 'camera')

        if (isCurrentUser) {
            if (!streamInfo) {
                //add stream to participant
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: !participant.isCameraOff,
                    audio: true,
                })
                streamInfo = {
                    type: 'camera',
                    userId: user.id,
                    stream: stream,
                } as MediaStreamInfo
                this.addStreamToParticipant(user.id, streamInfo)
                this.ee.emit("streamAdded", streamInfo)
            }
            // else if (streamInfo.stream.getAudioTracks().length === 0) {
            //     const stream = await navigator.mediaDevices.getUserMedia({
            //         video: !participant.isCameraOff,
            //         audio: true,
            //     })
            //     streamInfo = {
            //         type: 'camera',
            //         userId: user.id,
            //         stream: stream,
            //     } as MediaStreamInfo
            //     const audioTrack = streamInfo.stream.getAudioTracks()[0]
            //     this.addTrackToParticipantStream(user.id, stream, audioTrack)
            //     this.ee.emit("trackAdded", audioTrack, stream)
            // }
        }
        this.currentCall.update((call) => {
            if (!call) {
                return call
            }
            call.participants.update((participants) => {
                const participant = participants.find(participant => participant.id === user.id)
                if (!participant) {
                    return participants
                }
                participant.isMuted = !participant.isMuted
                return participants
            })
            return call
        })
        if (!streamInfo) {
            console.log('no audio track')
            return
        }
        streamInfo.stream.getTracks().forEach(track => {
            if (track.kind === 'video') {
                track.enabled = !participant.isCameraOff
            } else if (track.kind === 'audio') {
                track.enabled = !participant.isMuted
            }
        })
    }

    async toggleVideo(user: User, isCurrentUser: boolean = false) {
        const currentCall = get(this.currentCall)
        if (!currentCall) {
            return
        }
        const participants = get(currentCall.participants)
        const participant = participants.find(participant => participant.id === user.id)
        if (!participant) {
            return
        }
        let streamInfo = participant.stream.find(stream => stream.type === 'camera')
        if (isCurrentUser) {
            if (!streamInfo) {
                //add stream to participant
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: !participant.isMuted,
                })
                streamInfo = {
                    type: 'camera',
                    userId: user.id,
                    stream: stream,
                } as MediaStreamInfo
                this.addStreamToParticipant(user.id, streamInfo)
                this.ee.emit("streamAdded", streamInfo)
            }
            // else if (streamInfo.stream.getVideoTracks().length === 0) {
            //     const stream = await navigator.mediaDevices.getUserMedia({
            //         video: true,
            //         audio: !participant.isMuted,
            //     })
            //     streamInfo = {
            //         type: 'camera',
            //         userId: user.id,
            //         stream: stream,
            //     } as MediaStreamInfo
            //     const videoTrack = streamInfo.stream.getVideoTracks()[0]
            //     this.addTrackToParticipantStream(user.id, streamInfo.stream, videoTrack)
            //     this.ee.emit("trackAdded", videoTrack, stream)
            // }
        }
        this.currentCall.update((call) => {
            if (!call) {
                return call
            }
            call.participants.update((participants) => {
                const participant = participants.find(participant => participant.id === user.id)
                if (!participant) {
                    return participants
                }
                participant.isCameraOff = !participant.isCameraOff
                return participants
            })
            return call
        })
        if (!streamInfo) {
            console.log('no video track')
            return
        }
        streamInfo.stream.getTracks().forEach(track => {
            if (track.kind === 'video') {
                track.enabled = !participant.isCameraOff
            } else if (track.kind === 'audio') {
                track.enabled = !participant.isMuted
            }
        })
    }

    async toggleScreenShare(user: User, isCurrentUser: boolean) {
        const currentCall = get(this.currentCall)
        if (!currentCall) {
            return
        }
        const participants = get(currentCall.participants)
        const participant = participants.find(participant => participant.id === user.id)
        if (!participant) {
            return
        }
        let streamInfo = participant.stream.find(stream => stream.type === 'screen')
        if (isCurrentUser) {
            if (!streamInfo) {
                //add stream to participant
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: false,
                })
                streamInfo = {
                    type: 'screen',
                    userId: user.id,
                    stream: stream,
                } as MediaStreamInfo
                this.addStreamToParticipant(user.id, streamInfo)
                this.ee.emit("streamAdded", streamInfo)
            }
        }
        this.currentCall.update((call) => {
            if (!call) {
                return call
            }
            call.participants.update((participants) => {
                const participant = participants.find(participant => participant.id === user.id)
                if (!participant) {
                    return participants
                }
                participant.isScreenSharing = !participant.isScreenSharing
                return participants
            })
            return call
        })
        if (!streamInfo) {
            console.log('no video track')
            return
        }
        streamInfo.stream.getTracks().forEach(track => {
            if (track.kind === 'video') {
                track.enabled = !participant.isScreenSharing
            } else if (track.kind === 'audio') {
                track.enabled = !participant.isMuted
            }
        })
    }
}