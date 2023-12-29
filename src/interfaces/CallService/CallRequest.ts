import type {CallParticipant} from "./CallParticipant";

export interface CallRequest {
    id: string,
    callerId: string,
    participants:CallParticipant[],
    metadata: {
        conversationId: string,
        avatar: string,
    }
}