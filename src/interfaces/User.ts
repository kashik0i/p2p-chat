export class User {
    // gender: string;
    name: {
        first: string;
        last: string;
    };
    // location: {
    //     street: {
    //         number: number;
    //         name: string;
    //     };
    //     city: string;
    //     state: string;
    //     country: string;
    //     postcode: number;
    //     coordinates: {
    //         latitude: string;
    //         longitude: string;
    //     };
    //     timezone: {
    //         offset: string;
    //         description: string;
    //     };
    // };
    // email: string;
    // login: {
    //     uuid: string;
    //     username: string;
    //     password: string;
    //     salt: string;
    //     md5: string;
    //     sha1: string;
    //     sha256: string;
    // };
    // dob: {
    //     date: string;
    //     age: number;
    // };
    // registered: {
    //     date: string;
    //     age: number;
    // };
    // phone: string;
    // cell: string;
    id: string;
    // picture: {
    //     large: string;
    //     medium: string;
    //     thumbnail: string;
    // };
    // nat: string;
    avatar: string;
    peerId: string = '';
    online: boolean = false;

    constructor(data: {
        name: { last: string; first: string };
        id: string;
        avatar: string,
        peerId?: string,
        online?: boolean
    }) {
        this.name = data.name;
        this.id = data.id;
        this.avatar = data.avatar;
        this.peerId = data.peerId || '';
        this.online = data.online || false;
    }

    get fullName() {
        return `${this.name.first} ${this.name.last}`;
    }
}

