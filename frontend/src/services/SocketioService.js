import io from 'socket.io-client';

class SocketioService {
    socket;
    constructor() { }

    setupSocketConnection() {
        this.socket = io("http://localhost:4000", {
            transports: ["websocket"]
        })

        return this.socket;
    }
}

export default new SocketioService();
