import {ChatService} from "./ChatService";
import {PeerService} from "./PeerService";
import {UserService} from "./UserService";
import {UserSeederService} from "./UserSeederService";
import {get, type Writable, writable} from "svelte/store";
import {type ColorScheme, colorScheme} from "@svelteuidev/core";
import type {Message} from "@/interfaces/Message";
import {guid} from "@/utils";
import {MessageTypeEnum} from "@/enums/MessageTypeEnum";
import {CallService} from "@services/CallService";
import {CallStateEnum} from "@/enums/CallStateEnum";
import {User} from "@/interfaces/User";
import type {PeerCall} from "@/interfaces/CallService";
import type {MediaStreamInfo} from "@/interfaces/MediaStreamInfo";
import type {CallRequest} from "@/interfaces/CallService/CallRequest";
import type {CallParticipant} from "@/interfaces/CallService/CallParticipant";

export class ApplicationManager {
    callService: CallService;
    chatService: ChatService;
    peerService: PeerService;
    userService: UserService;
    users = writable<User[]>([])
    theme = colorScheme
    userSeederService: UserSeederService = new UserSeederService()

    constructor() {
        console.log('ApplicationManager constructor')
        this.userService = new UserService()
        this.peerService = new PeerService()
        this.chatService = new ChatService()
        this.callService = new CallService()
        this.init()

        this.userService.user.update((user) => {
            user.peerId = this.peerService.selfId
            console.log('user', user)
            return user
        });
        this.peerService.ee.on('message', (message) => {
            console.log('received message', message)
            this.chatService.conversations.update((conversations) => {
                if (!message.conversationId) return conversations;
                conversations.find(conversation => conversation.id === message.conversationId)!.messages.push(message)

                return conversations
            })
        })
        this.peerService.ee.on('file', (data: Uint8Array, peerId, message) => {
            console.log('received file', data, peerId, message)
            const file = new File([data], message.metadata.name, {type: message.metadata.type});
            message.content = URL.createObjectURL(file)
            this.chatService.addMessage(message)
        })
        this.peerService.ee.on('join', async (peerId) => {
            //send user info
            const currentUser = get(this.userService.user)
            await this.peerService.actions.user.send(currentUser)
        })
        this.peerService.ee.on('leave', (peerId) => {
            this.users.update((users) => {
                const user = users.find(user => user.peerId === peerId)
                if (user) {
                    user.online = false
                }
                return users
            })
        })
        this.peerService.ee.on('user', async (user) => {
            console.log('received user', user)
            this.upsertUser(user)
            const currentCall = get(this.callService.currentCall)
            if (!currentCall) {
                return
            }
            const currentUser = get(this.userService.user)
            const participants = get(currentCall.participants)
            const participant = participants.find(participant => participant.id === user.id)
            if (!participant) {
                return;
            }
            switch (participant.status) {
                case CallStateEnum.Answered:
                    const streamInfo = this.callService.getUserStream(currentUser.id)
                    if (!streamInfo) {
                        return
                    }
                    streamInfo.forEach((streamInfo) => {
                        this.peerService.instance.addStream(streamInfo.stream, user.peerId, {
                            mediaStreamInfo: {
                                type: streamInfo.type,
                                userId: currentUser.id
                            }
                        })
                    })
                    break;
                case CallStateEnum.Ringing:
                case CallStateEnum.Idle:
                    const callRequest = this.callService.createCallRequest(currentCall)
                    await this.peerService.actions.call.send(callRequest, [user.peerId])
                    break;
            }

        })

        this.peerService.ee.on('call', async (call: CallRequest) => {
            const currentCall = get(this.callService.currentCall)
            const currentUser = get(this.userService.user)
            if (!currentCall) {
                //TODO ask user to accept call and send ringing state
                //send ringing
                await this.peerService.actions.callData.send({
                    id: call.id,
                    state: CallStateEnum.Ringing,
                    senderId: currentUser.id,
                    receiverId: call.callerId,
                })
                const caller = this.getUserById(call.callerId)
                if (!caller) {
                    throw new Error('caller not found')
                }
                this.callService.currentCall.set({
                    id: call.id,
                    callerId: call.callerId,
                    //TODO: add participants
                    participants: writable(call.participants.map(participant => ({
                        id: participant.id,
                        status: participant.id === currentUser.id ? CallStateEnum.Answered : CallStateEnum.Ringing,
                        // peerId: participant.peerId,
                        // stream: writable<MediaStream[]>([]),
                        stream: [],
                        isMuted: true,
                        isCameraOff: true,
                    }))) as Writable<CallParticipant[]>,
                    state: CallStateEnum.Ringing,
                    metadata: call.metadata
                } as PeerCall)
                return
            }
            const participants = get(currentCall.participants)
            const isParticipantInCurrentCall = participants.find(participant => participant.id === call.callerId)
            const isSameConversation = currentCall.metadata.conversationId === call.metadata.conversationId
            //This is probably a call from another device or reconnection
            //TODO: check if call is not ended
            const isSameCall = currentCall.id === call.id
            if (isSameCall || isSameConversation || isParticipantInCurrentCall) {
                await this.peerService.actions.callData.send({
                    id: call.id,
                    state: CallStateEnum.Answered,
                    senderId: currentUser.id,
                    receiverId: call.callerId,
                })
                //add user to call participants
                this.callService.currentCall.update((currentCall) => {
                    if (!currentCall) {
                        console.error('currentCall not found')
                        return currentCall
                    }
                    currentCall.participants.update((participants) => {
                        const participant = participants.find(participant => participant.id === call.callerId)
                        if (!participant) {
                            participants.push({
                                id: call.callerId,
                                status: CallStateEnum.Answered,
                                // peerId: call.callerId,
                                // stream: writable<MediaStream[]>([]),
                                stream: [],
                                isMuted: true,
                                isCameraOff: true,
                            })
                        } else {
                            participant.status = CallStateEnum.Answered
                        }
                        return participants
                    })
                    return currentCall
                })
                return
            }

            await this.peerService.actions.callData.send({
                id: call.id,
                state: CallStateEnum.Busy,
                senderId: currentUser.id,
                receiverId: call.callerId,
            })
        })
        this.peerService.ee.on('callData', async (callData, peerId) => {
            console.log('received callData', callData)
            const currentCall = get(this.callService.currentCall)
            if (!currentCall) {
                return
            }
            switch (callData.state) {
                case  CallStateEnum.Busy:
                case CallStateEnum.Ended:
                    const currentUser = get(this.userService.user)
                    const streams = this.callService.getUserStream(callData.senderId)
                    if (!streams) {
                        return
                    }
                    streams.forEach(({stream}) => {
                        this.peerService.instance.removeStream(stream, [peerId])
                    })
                    this.callService.dropUserFromCall(callData.senderId)

                    //TODO: if no participants left and call type is not group, end call
                    const isGroupCall = currentCall.metadata.conversationId !== undefined
                    const isCallEnded = get(currentCall.participants).length === 0
                    if (!isGroupCall && isCallEnded) {
                        this.callService.endCall()
                    }
                    break;
                case CallStateEnum.Answered:
                    this.callService.updateParticipantState(callData.state, callData.senderId)
                    //TODO: start call
                    break;
                case CallStateEnum.Ringing:
                    this.callService.updateParticipantState(callData.state, callData.senderId)
                    //TODO: send reject after 30 seconds
                    break;
            }
        })
        this.peerService.ee.on('stream', (stream, peerId, metadata) => {
            console.log('received stream', stream, peerId, metadata)
            this.callService.currentCall.update((currentCall) => {
                if (!currentCall) {
                    return currentCall
                }
                currentCall.participants.update((participants) => {
                    console.log(metadata)
                    const participant = participants.find(participant => participant.id === metadata.mediaStreamInfo.userId)
                    if (!participant) {
                        console.info('participant not found', peerId)
                        return participants
                    }
                    // metadata.mediaStreamInfo.stream = stream
                    participant.stream.push({
                        stream,
                        type: metadata.mediaStreamInfo.type,
                        userId: metadata.mediaStreamInfo.userId,
                    } as MediaStreamInfo)
                    participant.isCameraOff = false
                    participant.isMuted = false
                    // this.callService.addStreamToParticipant(participant.id, metadata.mediaStreamInfo)
                    return participants
                })
                return currentCall
            })
        })
        this.peerService.ee.on('track', (track, stream, peerId) => {
            console.log('received track', track, stream, peerId)
            this.callService.currentCall.update((currentCall) => {
                if (!currentCall) {
                    return currentCall
                }
                const users = get(this.users)
                const participant = get(currentCall.participants).find(participant => participant.id === users.find(user => user.peerId === peerId)?.id)
                if (!participant) {
                    console.info('participant not found', peerId)
                    return currentCall
                }
                participant.stream.find(streamInfo => streamInfo.stream.id === stream.id)?.stream.addTrack(track)
                if(track.kind === 'audio'){
                    participant.isMuted = false
                }else{
                    participant.isCameraOff = false
                }
                // this.callService.addTrackToParticipantStream(participant.id, stream, track)
                // this.callService.addStreamToParticipant(participant.id, stream)
                return currentCall
            })
        })

        this.callService.ee.on('streamAdded', (streamInfo) => {
            const users = get(this.users)
            const peers = this.callService.getParticipants().map(participant => users.find(user => user.id === participant.id)?.peerId ?? "")
            this.peerService.instance.addStream(streamInfo.stream, peers, {
                mediaStreamInfo: {
                    type: 'camera',
                    userId: streamInfo.userId
                }
            })
        })

        this.callService.ee.on('streamRemoved', (streamInfo) => {
            const users = get(this.users)
            const peers = this.callService.getParticipants().map(participant => users.find(user => user.id === participant.id)?.peerId ?? "")
            this.peerService.instance.removeStream(streamInfo.stream, peers)
        })

        this.callService.ee.on('trackAdded', (track, stream) => {
            const users = get(this.users)
            const peers = this.callService.getParticipants().map(participant => users.find(user => user.id === participant.id)?.peerId ?? "")
            this.peerService.instance.addTrack(track, stream, peers)
        })

        //TODO: remove this hack
        this.resetUserCallControls()

        const theme = localStorage.getItem('theme') as ColorScheme | undefined
        if (theme) {
            this.theme.set(theme)
        }
        this.theme.subscribe((value) => {
            localStorage.setItem('theme', value)
        })

    }

    private init() {
        // this.userSeederService.seedUsers()
        // this.chatService.seedConversations()
        // this.chatService.seedMessages()
        // this.chatService.seedUsers()
        const users = localStorage.getItem('users')
        this.users.set(users ? JSON.parse(users) : [])
        this.users.subscribe(users => {
            localStorage.setItem("users", JSON.stringify(users))
            // update users in global chat
            this.chatService.conversations.update((conversations) => {
                const globalChat = conversations.find(conversation => conversation.id === import.meta.env.VITE_GLOBAL_CHAT_ID)
                if (!globalChat) {
                    return conversations
                }
                globalChat.users = users as User[]
                return conversations
            })
            // update users in call
            // const currentCall = get(this.callService.currentCall)
            // if (!currentCall) {
            //     return
            // }
            // currentCall.participants.update((participants) => {
            //     participants.forEach(participant => {
            //         const user = users.find(user => user.id === participant.id)
            //         if (!user) {
            //             return
            //         }
            //         participant.peerId = user.peerId
            //         participant.id = user.id
            //     })
            //     return participants
            // })
        })
        this.userService.user.subscribe((user) => this.upsertUser(user))

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
            senderId: user.id,
            conversationId,
            timestamp: Date.now(),
            type: MessageTypeEnum.TEXT
        } as Message;
        //TODO: send to conversationId users
        const users = this.chatService.getUsersByConversationId(conversationId)?.values()
        const peerIds = users ? Array.from(users).map(user => user.peerId) : []
        await this?.peerService?.actions.message.send(message, peerIds)
        this.chatService.addMessage(message)
    }

    async broadcast(value: string) {
        const user = get(this?.userService?.user)
        if (!user) {
            throw new Error('user not found')
        }
        console.log('sending message', user)
        const message: Message = {
            id: guid(),
            content: value,
            senderId: user.id.toString(),
            timestamp: Date.now(),
            type: MessageTypeEnum.FILE
        };
        await this?.peerService?.actions.message.send(message)
        this.chatService.addMessage(message)
    }

    async sendFile(file: File, type: MessageTypeEnum, conversationId: string) {
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
        const users = this.chatService.getUsersByConversationId(conversationId)?.values()
        const peerIds = users ? Array.from(users).map(user => user.peerId) : []
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
            const arrayBuffer = reader.result as ArrayBuffer
            const uint8Array = new Uint8Array(arrayBuffer)
            // @ts-ignore
            await this.peerService.actions.file.send(uint8Array, peerIds, message)
        }

        message.content = URL.createObjectURL(file)
        this.chatService.addMessage(message)
    }

    async createCall(calleeId: string) {
        //callee is a user or a group
        const currentUser = get(this.userService.user)
        if (!currentUser) {
            throw new Error('user not found')
        }
        const callee = this.getUserById(calleeId)
        const participants: User[] = []
        if (callee) {
            participants.push(callee)
            await this.callService.createCall(currentUser, participants);
        } else {
            const group = this.chatService.getConversationById(calleeId)
            if (!group) {
                //TODO allow to create new group call
                throw new Error('group not found')
            }
            const isUserInGroup = group.users.find(user => user.id === currentUser.id)
            if (!isUserInGroup) {
                throw new Error('user not in group')
            }
            participants.push(...group.users)
            //auto answer call because callee is a group
            await this.callService.createCall(currentUser, group.users, calleeId, true)
        }

        const currentCall = get(this.callService.currentCall)
        if (!currentCall) {
            throw new Error('currentCall not found')
        }
        const callRequest = this.callService.createCallRequest(currentCall)
        const peerIds = participants.map(participant => participant.peerId)
        await this.peerService.actions.call.send(callRequest, peerIds)
        //send request to all participants, drop user if not answered in 30 seconds
        window.setTimeout(() => {
            const currentCall = get(this.callService.currentCall)
            if (!currentCall) {
                return
            }
            const participants = get(currentCall.participants)
            participants.forEach(participant => {
                if(participant.status !== CallStateEnum.Answered){
                    this.callService.dropUserFromCall(participant.id)
                }
            })
        }, 30000)
    }

    async toggleCall(calleeId: string) {
        const currentCall = get(this.callService.currentCall)
        if (currentCall) {
            await this.peerService.actions.callData.send({
                id: currentCall.id,
                state: CallStateEnum.Ended,
                senderId: get(this.userService.user).id,
                receiverId: calleeId,
            })
            this.callService.endCall()
            return
        }
        if (!calleeId) {
            alert('Please select a user to call')
            return
        }
        await this.createCall(calleeId)

    }

    async answerCall() {
        const currentCall = get(this.callService.currentCall)
        const users = get(this.users)
        if (!currentCall) {
            throw new Error('currentCall not found')
        }
        if (currentCall.state !== CallStateEnum.Ringing) {
            throw new Error('call is not ringing')
        }
        const currentUser = get(this.userService.user)
        const peerIds = get(currentCall.participants)
            .filter(participant => participant.id !== currentUser.id)
            //maybe peerId is not set yet
            .map(participant => users.find(user => user.id === participant.id)?.peerId ?? "")
        await this.peerService.actions.callData.send({
            id: currentCall.id,
            state: CallStateEnum.Answered,
            senderId: get(this.userService.user).id,
            receiverId: currentCall.callerId,
        }, peerIds)
        this.callService.updateParticipantState(CallStateEnum.Answered, currentCall.callerId)
        this.callService.updateParticipantState(CallStateEnum.Answered, currentUser.id)
        this.callService.startCall()
        //TODO: call other participants
        // await this.peerService.actions.call.send(currentCall, peerIds)

    }

    async toggleVoice(user: User) {
        const currentUser = get(this.userService.user)
        const isCurrentUser = user.id === currentUser.id
        await this.callService.toggleVoice(user, isCurrentUser)
    }

    async toggleCamera(user: User) {
        const currentUser = get(this.userService.user)
        const isCurrentUser = user.id === currentUser.id
        await this.callService.toggleVideo(user, isCurrentUser)
    }

    async toggleScreenShare(user: User) {
        // await this.callService.toggleShareScreen(user, 'screen', 'video', true)
    }


    upsertUser(user: User) {
        this.users.update((users) => {
            const index = users.findIndex(u => u.id === user.id)
            if (index !== -1) {
                users[index] = user
            } else {
                users.push(user)
            }
            return users
        })
    }

    getUserById(userId: string) {
        const users = get(this.users)
        return users.find(user => user.id === userId)
    }


    private resetUserCallControls() {
        const currentUser = get(this.userService.user)
        this.callService.currentCall.update(currentCall => {
            if (!currentCall) {
                return currentCall
            }
            currentCall.participants.update((participants) => {
                const participant = participants.find(participant => participant.id === currentUser.id)
                if (!participant) {
                    console.info('participant not found', currentUser.id)
                    return participants
                }
                participant.isCameraOff = true
                participant.isMuted = true
                return participants
            })
            return currentCall
        })
    }
}

