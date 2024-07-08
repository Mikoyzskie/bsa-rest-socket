import { showMessageModal } from '../views/modal.mjs';

//If Username already exists

const returnHome = () => {
    sessionStorage.removeItem('username');
    window.location.replace('/signin');
};

export const onClose = () => {
    showMessageModal({ message: 'User already existed', onClose: returnHome });
};
