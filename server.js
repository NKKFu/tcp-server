const net = require('net');
const { v4: uuidv4 } = require('uuid');


const socketsList = [];

const server = net.createServer((socket) => {
    const client = {
        socket,
        id: uuidv4(),
        ip: socket.remoteAddress
    };

    socket.write(JSON.stringify({
        id: uuidv4(),
        ip: socket.remoteAddress
    }));

    socketsList.push(client);

    server.getConnections((error, count) => {
        console.log(`Current connections ${count}`);
    });

    socket.setEncoding('utf8');


    socket.on('data', (data) => {

        socketsList.forEach(socketElement => {
            if (socketElement.id !== client.id)
                socketElement.socket.write(data);
        });

        const dataResult = data.toString();

        // Disconnect user
        if (dataResult == 'e') {
            socket.end('goodbye');
        }
    })

    socket.on('end', () => {
        server.getConnections((error, count) => {
            console.log(`Current connections ${count}`);
        })
    });

    // socket.setTimeout(3000);
    socket.on('timeout', () => {
        console.log('socket timeout');
        socket.end();
    });

    socket.on('end', () => {
        const clientIndex = socketsList.indexOf(client);
        socketsList.splice(clientIndex, 1);
    })
}).on('error', (err) => {
    // Handle errors here.
    throw err;
});

// Grab an arbitrary unused port.
server.listen(3040, () => {
    console.log('Server information: ', server.address());
});