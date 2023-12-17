import type {MessageTypeEnum} from "@/enums/MessageTypeEnum";

export interface Message {
    id: string;
    content: string|File;
    senderId: string;
    timestamp: number;
    conversationId?: string;
    type: MessageTypeEnum;
    metadata?: any;
}