import { useState } from "react";
import Modal, { ModalProps } from "./Modal";

import { ButtonInput } from "../ModalButton/ModalButton";

const defaultModalProps = {
    buttons: [],
    message: "",
    modalOpen: false,
    title: "",
}

type inputModalProps = {
    buttons: ButtonInput[],
    message?: string,
    modalOpen: boolean,
    title: string,
    component?: JSX.Element,
}

export default function useModal(modelProps: inputModalProps = defaultModalProps): [modal: JSX.Element, setModal: (modalProps: inputModalProps) => void] {
    const [modalOpen, setModalOpen] = useState(modelProps.modalOpen);
    const [modalButtons, setModalButtons] = useState(modelProps.buttons);
    const [modalMessage, setModalMessage] = useState(modelProps.message || "");
    const [modalTitle, setModalTitle] = useState(modelProps.title);
    const [modalComponent, setModalComponent] = useState(modelProps.component || <></>);



    function closeModal() {
        setModalOpen(false);
        return;
    }

    function setModal(newModalProps: ModalProps) {
        setModalOpen(() => newModalProps.modalOpen);
        setModalButtons(() => newModalProps.buttons);
        setModalMessage(() => newModalProps.message || "");
        setModalTitle(() => newModalProps.title);
        setModalComponent(() => newModalProps.component || <></>);
        return;
    }

    const modal = <Modal title={modalTitle} component={modalComponent} closeModal={closeModal} buttons={modalButtons} message={modalMessage} modalOpen={modalOpen} />


    return [modal, (newModal) => setModal({ ...newModal, modalOpen: true, closeModal: closeModal })];
}