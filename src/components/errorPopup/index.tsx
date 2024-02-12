import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

interface ErrorPopupProps {
    open: boolean
    closePopup: () => void
    errorMsg: string
}
const ErrorPopup = (props: ErrorPopupProps) => {
    const {closePopup, errorMsg, open} = props
    return (
        <React.Fragment>
            <Modal isOpen={open}>
                <ModalHeader toggle={closePopup}>Mettler Health Care</ModalHeader>
                <ModalBody>
                  {errorMsg}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={closePopup}>
                       OK
                    </Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    )
}

export default ErrorPopup