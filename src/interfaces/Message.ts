import type {User} from "@/interfaces/User";

export interface Message {
    id: string;
    content: string;
    sender: User;
    // receiver: string;
    timestamp: number;
}