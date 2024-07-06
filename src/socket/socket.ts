import { Server } from 'socket.io';

import * as config from './config.js';

export default (io: Server) => {
    let users: string[] = [];

    io.on('connection', socket => {
        const userExists = () => {
            // username = null;
            socket.emit('username_exists');
        };

        // let username: string | null = socket.handshake.query.username;

        let username = socket.handshake.query.username as string;

        // console.log(typeof username);

        if (!users.includes(username)) {
            users.push(username);
            console.log(users);
        } else {
            userExists();
        }

        socket.on('disconnect', () => {
            users = users.filter(user => user !== username);
            console.log(`${username} disconnect`);

            console.log(users);
        });
    });
};
