'use strict';

import {createConnection} from "./protocol/ao_protocol";

const net = require('net');
const server = net.createServer(conn => {
    createConnection(conn);
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