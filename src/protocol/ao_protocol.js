import {createClient} from "../game/client";

export function createConnection(socket) {
    const client = createClient();

    const sendRawMessage = (msg) => {
        console.log('sending ' + msg);
        socket.write(msg, 'utf8')
    };

    const sendCommand = (cmd, ...args) => {
        const delimiter = '#';
        let msg = cmd + delimiter + args.join(delimiter) + '#%';
        sendRawMessage(msg);
    };

    addHandlers(client, socket);

    sendCommand('decryptor', 34);
    sendCommand('FL', 'yellowtext', 'customobjections', 'flipping', 'fastloading', 'noencryption', 'deskmod', 'evidence');

    const buffer = Buffer.alloc(8192);
    buffer.curSize = 0;

    socket.on('data', data => onData(client, data, buffer));
}

function addHandlers(client, socket) {
    client.disconnect = () => {
        socket.end();
    };

    client.sendMessage = (msg) => {
        // TODO
    };
}

function onData(client, data, buffer) {
    buffer.curSize += data.copy(buffer, buffer.curSize);
    if (buffer.curSize >= buffer.length) {
        client.disconnect();
        return;
    }
    const idx = buffer.indexOf('#%', 0, 'utf8');
    if (idx === -1)
        return;
    const str = buffer.toString('utf8', 0, idx);
    buffer.copy(buffer, 0, idx + 2);
    buffer.curSize -= idx + 2;

    let msg = str.split('#');
    let cmd = msg[0];

    // special case for HI
    if (msg[0] === '' && msg[1] === '48E0') {
        cmd = 'HI';
        msg[1] = msg[2];
    }

    let args = msg.slice(1);

    // TODO improve dispatch and argument validation
    switch (cmd) {
        case 'HI':
            cmdHI(args);
            break;
        default:
            break;
    }

    console.log(msg);
}

function cmdHI(args) {
    let hdid = args[0];
    console.log(hdid);
}