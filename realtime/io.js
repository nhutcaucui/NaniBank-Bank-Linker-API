const server = require('http').createServer();
const io = require('socket.io')(3000);

io.on('connection', client => {
    client.on('connect', () => {
        console.log('[Socket] -', 'connect', client.id);
        client.emit('connection-update');
    });

    client.on('connection-update', (name) => {
        console.log('[Socket] -', "connection-update", name);
        client.name = name;
        io.users[name] = client;
    });

    client.on('client-notification', (to, message) => {
        console.log('[Socket] -', "client-notification", name);
        io.users[to].emit('notification', message);
    });

    client.on('disconnect', () => {
        console.log('[Socket] - ', 'disconnect', io.users[client.name]);
        delete io.users[client.name];
    });
});

server.listen(8220, () => {
    console.log('[Socket] - ', 'Listening on', 8220);
});

module.exports = io;