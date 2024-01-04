import type Peer from "peerjs";
import {CallStateEnum} from "@/enums/CallStateEnum";
import type {MediaConnection} from "peerjs";
import type {MediaStreamInfo} from "@/interfaces/MediaStreamInfo";
import type {CallParticipant} from "./CallParticipant";
import type {Writable} from "svelte/store";

// export interface PeerCall {
//     peerConnection: Peer | null;
//     call: MediaConnection | null;
//     state: CallStateEnum
//     isMuted: boolean
//     isCameraOff: boolean
//     isScreenSharing: boolean,
//     participants: string[],
//     RoomId?: string,
//     localMediaStream: MediaStreamInfo[]
//     remoteMediaStream: Map<string,MediaStreamInfo[]>
// }


export interface PeerCall {
    id: string,
    callerId: string,
    participants: Writable<CallParticipant[]>,
    state: CallStateEnum,
    metadata: {
        conversationId: string,
        avatar: string,
    }
    volume: Writable<number>,
}