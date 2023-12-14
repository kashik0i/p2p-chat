import {User} from "@/interfaces/User";

export class UserService {
    user: User

    constructor() {
        console.log('UserService constructor');
        this.user = new User({
            name: {
                title: 'Mr.',
                first: 'John',
                last: 'Doe'
            },
            id: Math.random().toString(36).substring(7),
        })
    }
}