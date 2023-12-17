import type Peer from "peerjs";
import {CallStateEnum} from "@/enums/CallStateEnum";
import type {MediaConnection} from "peerjs";
import type {MediaStreamInfo} from "@/interfaces/MediaStreamInfo";

export interface PeerCall {
    peerConnection: Peer | null;
    call: MediaConnection | null;
    state: CallStateEnum
    isMuted: boolean
    isCameraOff: boolean
    isScreenSharing: boolean,
    participants: string[],
    RoomId?: string,
    localMediaStream: MediaStreamInfo[]
    remoteMediaStream: MediaStreamInfo[]
}
