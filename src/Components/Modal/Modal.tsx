import './Modal.css'
import { ModalProps } from './ModalTypes';




function Modal({ buttons, message, modalOpen, closeModal }: ModalProps) {
    if (modalOpen === false) return (<></>)



    buttons.push({ text: "Close", onClick: () => { closeModal() } });




    return (

        <div className="dark-screen">
            <div className="modal">
                <h3>{message}</h3>
                <div className="modal-buttons">
                    {buttons.map((button) => {
                        return (
                            <button onClick={button.onClick}>{button.text}</button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Modal