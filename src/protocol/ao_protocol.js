import {Client, createClient} from "../game/client";
import {Network} from "./network";

class AONetwork extends Network {
    sendCommand(cmd, ...args) {
        const delimiter = '#';
        let msg = cmd + delimiter + args.join(delimiter) + '#%';
        this.sendRawMessage(msg);
    }
}

class AOProtocol {
    constructor(socket, game) {
        this.client = createClient(new AONetwork(socket));
        this.game = game;

        const buffer = Buffer.alloc(8192);
        buffer.curSize = 0;

        socket.on('data', data => this.onData(data, buffer));

        this.handshake();
    }

    handshake() {
        this.client.network.sendCommand('decryptor', 34);
        this.client.network.sendCommand('FL', 'yellowtext', 'customobjections', 'flipping', 'fastloading', 'noencryption', 'deskmod', 'evidence');
    }

    disconnect() {

    }

    onData(data, buffer) {
        buffer.curSize += data.copy(buffer, buffer.curSize);
        if (buffer.curSize >= buffer.length) {
            this.disconnect();
            return;
        }

        while (true) {
            const idx = buffer.indexOf('#%', 0, 'utf8');
            if (idx === -1)
                break;
            const str = buffer.toString('utf8', 0, idx);
            buffer.copy(buffer, 0, idx + 2);
            buffer.curSize -= idx + 2;
            this.processMessage(str);
        }
    }

    processMessage(raw_message) {
        let msg = raw_message.split('#');
        let cmd = msg[0];

        // special case for HI
        if (msg[0] === '' && msg[1] === '48E0') {
            cmd = 'HI';
        }

        let args = msg.slice(1);

        switch (cmd) {
            case 'HI':
                this.dispatchCommand(this.cmdHI, args, 'str', 'str');
                break;
            default:
                break;
        }
    }

    dispatchCommand(callback, args, ...types) {
        if (args.length !== types.length) return;
        let newArgs = [];
        for (const [i, type] of types.entries()) {
            let value = args[i];
            if (type === 'str') {
                newArgs.push(value);
            } else if (type === 'int') {
                let numVal = Number.parseInt(value);
                if (isNaN(numVal)) return;
                newArgs.push(value);
            } else {
                return;
            }
        }
        callback(...newArgs);
    }

    cmdHI(ignored, hdid) {

    }
}

export function createConnection(socket, game) {
    new AOProtocol(socket, game);
}