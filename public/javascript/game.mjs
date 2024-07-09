import { addClass, removeClass } from './helpers/dom-helper.mjs';
import { removeUserElement, changeReadyStatus } from './views/user.mjs';
import { appendRoomElement, updateNumberOfUsersInRoom, removeRoomElement } from '../javascript/views/room.mjs';
import { appendUserElement } from '../javascript/views/user.mjs';
import { showInputModal, showMessageModal, showResultsModal } from '../javascript/views/modal.mjs';

import {
    addQuitRoomButton,
    updateRoom,
    createRoomElement,
    updateRooms,
    changeUserReadyStatus,
    updateNumberOfUsers,
    enterRoom
} from './room-helper.mjs';

import { startTimer, receiveText, setProgress, gameOver } from './game-helper.mjs';

const username = sessionStorage.getItem('username');

if (!username) {
    window.location.replace('/signin');
}

export const socket = io('', { query: { username } });

const addRoomBtn = document.getElementById('add-room-btn');

addRoomBtn.addEventListener('click', () => {
    let roomName = '';
    showInputModal({
        title: 'Add Room Name',
        onChange: value => {
            roomName = value;
        },
        onSubmit: () => {
            socket.emit('CREATE_ROOM', roomName);
        }
    });
});

socket.on('UPDATE_ROOMS', updateRooms);
socket.on('ROOM_EXISTS', () => {
    showMessageModal({ message: 'Room already exists', onClose: () => {} });
});
socket.on('CREATED_ROOM', roomname => {
    socket.emit('JOIN_ROOM', { roomname, isOwner: true });
    enterRoom(roomname);
    appendUserElement({ username: username, ready: false, isCurrentUser: true });
    addQuitRoomButton(roomname);
    changeUserReadyStatus(roomname);
});
socket.on('UPDATE_CONNECTED', updateNumberOfUsers);
socket.on('SHOW_ROOM', createRoomElement);
socket.on('HIDE_ROOM', roomname => {
    const roomElement = document.querySelector(`.room[data-room-name='${roomname}']`);
    if (roomElement) {
        roomElement.style.display = 'none';
    }
});
socket.on('UPDATE_ROOM', updateRoom);
socket.on('DELETE_ROOM', roomName => removeRoomElement(roomName));
socket.on('START_TIMER', startTimer);
socket.on('RECEIVE_TEXT', receiveText);
socket.on('SET_PROGRESS', setProgress);
socket.on('GAME_OVER', gameOver);

socket.on('DISPLAY_ROOM', roomname => {
    const roomElement = document.querySelector(`.room[data-room-name='${roomname}']`);
    if (roomElement) {
        roomElement.style.display = 'flex';
    }
});
socket.on('DELETE_DISCONNECTED_USER_CARD', username => {
    removeUserElement(username);
});
