const { Server } = require("socket.io");

const io = new Server({ /* options */ });

io.on("connection", (socket) => {
    console.log('client, connected', client.adapter.id);

    client.emit('test-event', { data: 'fake' });

    client.on('event', data => {
        console.log('Event', data.client);
        client.emit('test-event', 'Right back atcha');
    });


    client.on('disconnect', () => {
        console.log('Disconnect: ');
    });
});

io.listen(4000);
