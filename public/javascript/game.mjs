import { showMessageModal } from '../javascript/views/modal.mjs';

const username = sessionStorage.getItem('username');

if (!username) {
    window.location.replace('/signin');
}

const socket = io('http://localhost:3001/', { query: { username } });

//If Username already exists

const returnHome = () => {
    sessionStorage.removeItem('username');
    window.location.replace('/signin');
};

const onClose = () => {
    showMessageModal({ message: 'User already existed', onClose: returnHome });
};

socket.on('username_exists', onClose);
