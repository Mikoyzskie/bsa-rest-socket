import { appendRoomElement, removeRoomElement, updateNumberOfUsersInRoom } from '../views/room.mjs';

export const createRoom = () => {
    const roomname = prompt('Input Room Name');
    if (!roomname) return;
    socket.emit('CREATE_ROOM', roomname);
};

export const updateRooms = rooms => {
    roomsContainer.innerHTML = '';
    rooms.forEach(createRoomElement);
};

const createRoomElement = room => {
    appendRoomElement({
        name: room.name,
        numberOfUsers: room.users.length,
        onJoin: () => onJoin(room.name)
    });
};

const onJoin = roomname => {
    socket.emit('JOIN_ROOM', { roomname, isOwner: false });
    enterRoom(roomname);
    addQuitRoomButton(roomname);
    changeReadyStatus(roomname);
};

export const updateRoom = updatedRoom => {
    const usersContainer = document.querySelector('#users-wrapper');
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
