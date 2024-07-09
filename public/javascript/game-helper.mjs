import { socket } from './game.mjs';
import { addClass, removeClass } from './helpers/dom-helper.mjs';
import { changeReadyStatus } from './views/user.mjs';
import { removeRoomElement } from './views/room.mjs';
import { showResultsModal } from './views/modal.mjs';
import { keycodes } from './keycodes.mjs';

export const startTimer = roomname => {
    removeRoomElement(roomname);
    const quitRoomButton = document.getElementById('quit-room-btn');
    const readyButton = document.getElementById('ready-btn');
    const timer = document.getElementById('timer');

    quitRoomButton.style.visibility = 'hidden';
    readyButton.style.display = 'none';
    removeClass(timer, 'display-none');

    let i = 1;
    const interval = setInterval(() => {
        timer.innerText = 10 - i;
        i++;
        if (i === 11) {
            clearInterval(interval);
            addClass(timer, 'display-none');
            socket.emit('GET_TEXT', roomname);
        }
    }, 1000);
};

export const receiveText = ({ randomText, roomname }) => {
    const gameTimerSeconds = document.getElementById('game-timer-seconds');
    const textContainer = document.getElementById('text-container');
    const gameTimer = document.getElementById('game-timer');

    removeClass(textContainer, 'display-none');
    removeClass(gameTimer, 'display-none');

    textContainer.innerHTML = randomText.split('').reduce((acc, cur) => {
        return acc + `<span id='${keycodes.find(key => key.value === cur).code}'>${cur}</span>`;
    }, '');
    const letters = document.querySelectorAll('#text-container span');
    const notGreen = Array.from(letters).filter(letter => letter.class !== 'isGreen');

    document.addEventListener('keypress', event => {
        if (event.charCode == notGreen[0].id) {
            addClass(notGreen[0], 'isGreen');
            notGreen[0].style.backgroundColor = 'green';
            notGreen[0].style.textDecoration = 'none';
            if (notGreen.length > 1) notGreen[1].style.textDecoration = 'underline';
            notGreen.splice(0, 1);
            socket.emit('FIND_PROGRESS', {
                notReady: notGreen.length,
                entire: letters.length,
                roomname
            });
        }
    });
    for (let i = 1; i <= 60; i++) {
        (function () {
            const gameTimer = setTimeout(() => {
                gameTimerSeconds.innerText = 60 - i;
                if (gameTimerSeconds.innerText === '0') {
                    socket.emit('TIME_OVER', {
                        notReady: notGreen.length,
                        entire: letters.length,
                        roomname,
                        username
                    });
                }
            }, i * 1000);
            socket.on('GAME_OVER', () => clearTimeout(gameTimer));
        })(i);
    }
};

export const setProgress = ({ percent, username, roomname }) => {
    const progressBar = document.querySelector(`.user-progress[data-username='${username}']`);
    progressBar.style.width = `${percent}%`;

    const gameTimerSeconds = document.getElementById('game-timer-seconds');

    if (percent === 100) {
        progressBar.style.backgroundColor = 'greenyellow';
        socket.emit('USER_DONE', {
            percent,
            username,
            roomname,
            timeLefted: gameTimerSeconds.innerHTML
        });
    }
};

export const gameOver = ({ users }) => {
    const usersArray = users.map(user => {
        return [user.name, user.userTime];
    });
    const usersSortedArray = usersArray.sort((a, b) => {
        if (a[1] > b[1]) {
            return 1;
        }
        if (a[1] < b[1]) {
            return -1;
        }
        return 0;
    });
    showResultsModal({
        usersSortedArray,
        onClose: () => {
            const quitRoomButton = document.getElementById('quit-room-btn');
            const readyButton = document.getElementById('ready-btn');
            const progressBars = document.querySelectorAll('.user-progress');
            const gameTimer = document.getElementById('game-timer');
            const textContainer = document.getElementById('text-container');

            quitRoomButton.style.visibility = 'visible';
            readyButton.style.display = 'block';
            readyButton.innerText = 'READY';

            progressBars.forEach(progressBar => (progressBar.style.width = '0%'));
            usersSortedArray.forEach(user => changeReadyStatus({ username: user[0], ready: false }));

            addClass(textContainer, 'display-none');
            addClass(gameTimer, 'display-none');
        }
    });
};
