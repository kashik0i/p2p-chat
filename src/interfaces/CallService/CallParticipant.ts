import {CallStateEnum} from "@/enums/CallStateEnum";
import type {MediaStreamInfo} from "@/interfaces/MediaStreamInfo";

export interface CallParticipant {
    id: string,
    status: CallStateEnum,
    stream: MediaStreamInfo[],
    isMuted: boolean,
    isCameraOff: boolean,
}