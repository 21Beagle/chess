import './Modal.css'
import { ModalProps } from './ModalTypes';




function Modal({ buttons, message, modalOpen, closeModal, showCloseButton }: ModalProps) {
    if (modalOpen === false) return (<></>)


    if (showCloseButton) {
        buttons.push({ text: "Close", onClick: () => { closeModal() } });
    }




    return (

        <div className="dark-screen">
            <div className="modal thick-border">
                <h3>{message}</h3>
                <div className="modal-buttons">
                    {buttons.map((button) => {
                        return (
                            <button onClick={() => { button.onClick(); closeModal() }}>{button.text}</button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Modal