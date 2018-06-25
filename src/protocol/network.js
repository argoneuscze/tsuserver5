export class Network {
    constructor(socket) {
        this.socket = socket;
    }

    sendRawMessage(msg) {
        console.log('sending ' + msg);
        this.socket.write(msg, 'utf8')
    }

    sendMessage(msg) {
        throw 'Not implemented.'
    }
}