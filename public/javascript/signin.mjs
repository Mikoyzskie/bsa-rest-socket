const username = sessionStorage.getItem('username');

if (username) {
    window.location.replace('/game');
}

const submitButton = document.getElementById('submit-button');
const input = document.getElementById('username-input');

const getInputValue = () => input.value;

const returnHome = () => {
    sessionStorage.removeItem('username');
    window.location.replace('/signin');
};

const onClose = () => {
    showMessageModal({ message: 'User already existed', onClose: returnHome });
};

const onClickSubmitButton = () => {
    const inputValue = getInputValue();
    if (!inputValue) {
        return;
    }
    if (inputValue === username) {
        socket.on('username_exists', onClose);
    }
    sessionStorage.setItem('username', inputValue);
    window.location.replace('/game');
};

const onKeyUp = ev => {
    const enterKeyCode = 13;
    if (ev.keyCode === enterKeyCode) {
        submitButton.click();
    }
};

submitButton.addEventListener('click', onClickSubmitButton);
window.addEventListener('keyup', onKeyUp);
