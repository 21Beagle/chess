export type Button = {
    text: string,
    onClick: () => void
}

export type ModalProps = {
    buttons: Button[]
    message: string;
    modalOpen: boolean;
    closeModal: () => void;
}
