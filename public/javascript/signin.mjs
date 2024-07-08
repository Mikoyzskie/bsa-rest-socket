import { showMessageModal } from './views/modal.mjs';

const username = sessionStorage.getItem('username');

if (username) {
    window.location.replace('/game');
}

const submitButton = document.getElementById('submit-button');
const input = document.getElementById('username-input');

const getInputValue = () => input.value;

const onClickSubmitButton = () => {
    const inputValue = getInputValue();
    if (!inputValue) {
        return;
    }

    const socket = io('', { query: { inputValue } });

    socket.emit('USERNAME_CHECK', inputValue);

    socket.on('USER_ALREADY_EXISTS', name => {
        showMessageModal({
            message: 'User already exists',
            onClose: () => {
                window.location.replace('/signin');
            }
        });
    });

    socket.on('USER_CREATED', () => {
        sessionStorage.setItem('username', inputValue);
        window.location.replace('/game');
    });
};

const onKeyUp = ev => {
    const enterKeyCode = 13;
    if (ev.keyCode === enterKeyCode) {
        submitButton.click();
    }
};

submitButton.addEventListener('click', onClickSubmitButton);
window.addEventListener('keyup', onKeyUp);
