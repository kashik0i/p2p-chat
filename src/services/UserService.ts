import {User} from "@/interfaces/User";
import {generateAvatar} from "@utils/avatar";
import {writable} from "svelte/store";
import {generateName, guid} from "@/utils";

export class UserService {
    user = writable<User>()

    constructor() {
        console.log('UserService constructor');
        const id = guid()
        const userString = localStorage.getItem('user')
        if (userString) {
            const user = JSON.parse(userString)
            this.user.set(user)
        } else {
            const [first, last] = generateName().split(' ')
            this.user.set(new User({
                name: {
                    first,
                    last
                },
                id,
                avatar: generateAvatar(id.toString())
            }))
        }
        this.user.subscribe((value) => {
            localStorage.setItem('user', JSON.stringify(value))
        })
    }
}