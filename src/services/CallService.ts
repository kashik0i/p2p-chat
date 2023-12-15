import Peer from "peerjs";
import {CallStateEnum} from "@/enums/CallStateEnum";
import type {PeerCall} from "@/interfaces/PeerCall";
import {type Writable, writable} from "svelte/store";

export class CallService {
    call: Writable<PeerCall> = writable()

    constructor() {
        console.log('CallService constructor')
        const peer= new Peer()
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
        })
        peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                // Will print 'hi!'
                console.log(data);
            });
        })
        this.call.set({
            instance: peer,
            state: CallStateEnum.Idle,
            isOutgoing: false,
            isMuted: false,
            isCameraOff: false,
            isScreenSharing: false
        })

    }

    toggleMute() {
        this.call.update((value) => {
            value.isMuted = !value.isMuted
            return value
        });
    }

    toggleCamera() {
        this.call.update((value) => {
            value.isCameraOff = !value.isCameraOff
            return value
        });
    }

    toggleScreenSharing() {
        this.call.update((value) => {
            value.isScreenSharing = !value.isScreenSharing
            return value
        });
    }
}