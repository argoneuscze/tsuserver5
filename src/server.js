import {createConnection} from "./protocol/ao_protocol";
import {Game} from "./game/game";

const game = new Game();

const net = require('net');
const server = net.createServer(conn => {
    createConnection(conn, game);
});

server.on('error', err => {
    console.log('error occurred: ' + err);
});

server.listen({
    host: 'localhost',
    port: 50000,
    exclusive: true
}, () => {
    console.log('Server started.');
});