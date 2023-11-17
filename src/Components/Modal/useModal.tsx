import { useState } from "react";
import Modal from "./Modal";
import { Button, ModalProps } from "./ModalTypes";

const defaultModalProps = {
    buttons: [],
    message: "",
    modalOpen: false
}

type inputModalProps = {
    buttons: Button[],
    message: string,
    modalOpen: boolean
}

export default function useModal(modelProps: inputModalProps = defaultModalProps): [modal: JSX.Element, setModal: (modalProps: inputModalProps) => void] {
    const [modalOpen, setModalOpen] = useState(modelProps.modalOpen);
    const [modalButtons, setModalButtons] = useState(modelProps.buttons);
    const [modalMessage, setModalMessage] = useState(modelProps.message);



    function closeModal() {
        setModalOpen(false);
        return;
    }

    function setModal(newModalProps: ModalProps) {
        setModalOpen(() => newModalProps.modalOpen);
        setModalButtons(() => [...newModalProps.buttons]);
        setModalMessage(() => newModalProps.message);
        return;
    }

    const modal = <Modal closeModal={closeModal} buttons={modalButtons} message={modalMessage} modalOpen={modalOpen} />


    return [modal, (newModal) => setModal({ ...newModal, modalOpen: true, closeModal: closeModal })];
}