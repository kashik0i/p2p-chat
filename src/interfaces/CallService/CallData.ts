import type {CallStateEnum} from "@/enums/CallStateEnum";

export interface CallData {
    id: string,
    senderId: string,
    receiverId: string,
    state: CallStateEnum
    data?: any
}