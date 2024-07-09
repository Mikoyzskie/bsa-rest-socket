import { socket } from './game.mjs';
import { addClass } from './helpers/dom-helper.mjs';
import { removeUserElement, appendUserElement, changeReadyStatus } from './views/user.mjs';
import { appendRoomElement, updateNumberOfUsersInRoom } from './views/room.mjs';

const username = sessionStorage.getItem('username');
const quitRoomButton = document.getElementById('quit-room-btn');
const readyButton = document.getElementById('ready-btn');
const timer = document.getElementById('timer');
const roomsPage = document.getElementById('rooms-page');
const gamePage = document.getElementById('game-page');

export const addQuitRoomButton = roomname => {
    quitRoomButton.addEventListener('click', () => {
        readyButton.innerText = 'READY';
        readyButton.style.display = 'block';

        addClass(timer, 'display-none');

        roomsPage.style.display = 'block';

        gamePage.style.display = 'none';
        socket.emit('QUIT_ROOM', roomname);
        removeUserElement(username);
    });
};

export const onJoin = roomname => {
    socket.emit('JOIN_ROOM', { roomname, isOwner: false });
    enterRoom(roomname);
    addQuitRoomButton(roomname);
    changeUserReadyStatus(roomname);
};

const usersContainer = document.querySelector('#users-wrapper');
const roomsContainer = document.querySelector('#rooms-wrapper');

export const updateRoom = updatedRoom => {
    usersContainer.innerHTML = '';

    updatedRoom.users.forEach(user => {
        appendUserElement({
            username: user.name,
            ready: user.status,
            isCurrentUser: user.name === username
        });
        if (updatedRoom.quitedUser) removeUserElement(updatedRoom.quitedUser);
    });
};

export const createRoomElement = room => {
    appendRoomElement({
        name: room.name,
        numberOfUsers: room.users.length,
        onJoin: () => onJoin(room.name)
    });
};

export const updateRooms = rooms => {
    roomsContainer.innerHTML = '';
    rooms.forEach(createRoomElement);
};

export const changeUserReadyStatus = roomname => {
    const readyButton = document.getElementById('ready-btn');
    readyButton.addEventListener('click', () => {
        const status = readyButton.innerText === 'READY' ? true : false;
        changeReadyStatus({ username, ready: status });
        socket.emit('READY_STATUS', { status, username: username, roomname });
        if (status) return (readyButton.innerText = 'NOT READY');
        readyButton.innerText = 'READY';
    });
};

export const updateNumberOfUsers = updatedRoom => {
    const roomElement = document.querySelector(`.room[data-room-name='${updatedRoom.name}']`);
    roomElement.style.display = 'flex';
    if (updatedRoom.numberOfUsers === 5) {
        roomElement.style.display = 'none';
    }
    updateNumberOfUsersInRoom({
        name: updatedRoom.name,
        numberOfUsers: updatedRoom.users.length
    });
};

export const enterRoom = roomname => {
    const roomsPage = document.getElementById('rooms-page');
    const roomNameElement = document.getElementById('room-name');
    const gamePage = document.getElementById('game-page');

    roomsPage.style.display = 'none';
    gamePage.style.display = 'flex';
    roomNameElement.innerText = roomname;
};
