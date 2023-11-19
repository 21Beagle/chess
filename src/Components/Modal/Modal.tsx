import ModalButton, { ButtonInput } from '../ModalButton/ModalButton';
import './Modal.css'


export type ModalProps = {
    buttons: ButtonInput[]
    message?: string;
    modalOpen: boolean;
    closeModal: () => void;
    showCloseButton?: boolean;
    title: string;
    component?: JSX.Element;
}

function Modal({ buttons, message, modalOpen, closeModal, title = "", component = <></> }: ModalProps) {

    if (modalOpen === false) return (<></>)


    return (

        <div className="dark-screen">
            <div className="modal thick-border">
                <h2>{title}</h2>
                <p>{message}</p>
                {component}

                <div className="modal-buttons">
                    {buttons.map((button, index) => {
                        return (
                            <ModalButton key={index} text={button.text} icon={button.icon} pieceIconColour={button.pieceIconColour} onClick={button.onClick} closeModal={closeModal} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Modal