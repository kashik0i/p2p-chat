import {User} from "@/interfaces/User";
import {generateAvatar} from "@utils/avatar";
import {writable} from "svelte/store";
import {generateName, guid} from "@/utils";

export class UserService {
    user = writable<User>()

    constructor() {
        console.log('UserService constructor');

        this.init()
        this.user.subscribe((value) => {
            localStorage.setItem('user', JSON.stringify(value))
        })
        //if network is online, update user online status
        window.addEventListener('online', () => {
            this.user.update(user => {
                user.online = true
                return user
            })
        })
        //if network is offline, update user online status
        window.addEventListener('offline', () => {
            this.user.update(user => {
                user.online = false
                return user
            })
        })
    }

    private init() {
        const userString = localStorage.getItem('user')
        let user: User
        if (!userString) {
            this.createNewUser()
            return
        }
        user = JSON.parse(userString)
        user.online = navigator.onLine
        this.user.set(user)

    }

    private createNewUser() {
        const id = guid()
        const [first, last] = generateName().split(' ')
        this.user.set(new User({
            name: {
                first,
                last
            },
            id,
            avatar: generateAvatar(id.toString()),
            online: true,
        }))
    }
}