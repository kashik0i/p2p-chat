import type {ActionProgress, ActionReceiver, ActionSender} from "trystero";
import {User} from "@/interfaces/User";
import type {Message} from "@/interfaces/Message";
import type {CallData, PeerCall} from "@/interfaces/CallService";
import type {MediaStreamInfo} from "@/interfaces/MediaStreamInfo";
import type {CallRequest} from "@/interfaces/CallService/CallRequest";

export interface Action<T> {
    send: ActionSender<T>
    receive: ActionReceiver<T>
    progress: ActionProgress
}

export interface PeerEvent {
    join: (peerId: string) => void
    leave: (peerId: string) => void
    user: (user: User) => void

    call: (call: CallRequest) => void
    stream: (stream: MediaStream, peerId: string, metadata: {
        mediaStreamInfo: MediaStreamInfo,
    }) => void
    track: (track: MediaStreamTrack, stream: MediaStream, peerId: string) => void
    callData: (callData: CallData, peerId: string) => void

    message: (message: Message) => void,
    file: (file: Uint8Array, peerId: string, metadata: Message) => void,
    error: (error: Error) => void

    typing: (peerId: string) => void
    stoppedTyping: (peerId: string) => void
}

export interface PeerActions {
    message: Action<Message>
    user: Action<User>
    file: Action<Uint8Array>
    call: Action<CallRequest>
    callData: Action<CallData>
}