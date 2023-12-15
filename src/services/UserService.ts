import {User} from "@/interfaces/User";
import {generateAvatar} from "@utils/avatar";
import {writable} from "svelte/store";

export class UserService {
    user = writable<User>()

    constructor() {
        console.log('UserService constructor');
        const id = Math.random().toString(36).substring(7)
        this.user = writable(new User({
            name: {
                title: 'Mr.',
                first: 'John',
                last: 'Doe'
            },
            id,
            avatar: generateAvatar(id)
        }))
    }
}