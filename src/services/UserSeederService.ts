import {User} from "../interfaces/User";
import {type Results} from "../interfaces/UserSeeder";
import type {UserSeederResponse} from "../interfaces/UserSeeder";
import users from '../data/users.json' assert {type: "json"};
export class UserSeederService {
    constructor() {
        console.log('UserSeederService constructor');
    }

    async seed(): Promise<User[]> {
        // console.log('UserSeederService seed');
        // console.log(users.results)
        // return users.results.map((user:Results) => {
        //     // return new User(user)
        //     return new User({
        //         name: user.name,
        //         email: user.email,
        //         picture: user.picture,
        //         login: user.login,
        //         dob: user.dob,
        //         registered: user.registered,
        //         phone: user.phone,
        //         cell: user.cell,
        //         gender:user.gender,
        //         nat: user.nat,
        //         location: user.location,
        //         id: user.id,
        //     })
        // })
    }
}