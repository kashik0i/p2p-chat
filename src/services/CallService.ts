import  Peer from "peerjs";

export class CallService{
    instance:Peer
    constructor() {
        console.log('CallService constructor')
        this.instance = new Peer()
        this.instance.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        })
        this.instance.on('connection', (conn) => {
            conn.on('data', (data) => {
                // Will print 'hi!'
                console.log(data);
            });
        })
    }
}