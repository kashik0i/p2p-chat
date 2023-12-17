import type {Message} from "@/interfaces/Message";
import type {User} from "@/interfaces/User";

export interface Chat {
    id: string
    messages: Message[]
    users: Map<string,User>
    avatar: string
    name: string
}