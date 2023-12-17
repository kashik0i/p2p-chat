export interface Message {
    id: string;
    content: string;
    senderId: string;
    timestamp: number;
    conversationId?: string;
}