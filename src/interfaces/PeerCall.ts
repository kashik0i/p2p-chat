import type Peer from "peerjs";
import {CallStateEnum} from "@/enums/CallStateEnum";

export interface PeerCall {
    instance: Peer | null;
    state: CallStateEnum
    isOutgoing: boolean
    isMuted: boolean
    isCameraOff: boolean
    isScreenSharing: boolean
}
