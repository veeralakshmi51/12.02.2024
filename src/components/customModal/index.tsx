import React from 'react';
interface ModalProps{
    show: boolean
    handleClose: () => void
}
const CustomModal = (props: ModalProps) => {
    const {handleClose, show} = props
  const modalStyle = {
    display: show ? 'block' : 'none',
  };

  return (
    <div className="modal" style={modalStyle} tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"></h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Modal content goes here.</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={handleClose}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handleClose}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
