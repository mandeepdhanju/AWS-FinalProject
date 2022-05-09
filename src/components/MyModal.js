import React, { Children } from 'react'
import Modal from "react-bootstrap/Modal";

function MyModal({children, title, hideModal, isOpen}) {
  return (
    <div>
          <Modal show={isOpen} onHide={hideModal}>
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {children}
        </Modal.Body>
          <Modal.Footer>
            <button onClick={hideModal}>Close</button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default MyModal