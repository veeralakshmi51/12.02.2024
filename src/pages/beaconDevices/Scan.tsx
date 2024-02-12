import React, { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "primereact/button";
import Modal from 'react-bootstrap/Modal';
import { IconButton, TextField } from "@mui/material";
import { FaQrcode } from "react-icons/fa";

interface ScanProps {
  getAPI?: any
  forPC?: boolean
  onChange?: (e: any) => void
}
const Scan = (props: ScanProps) => {
  const { getAPI, forPC, onChange } = props
  const videoRef = useRef(null);
  const codeReader = new BrowserMultiFormatReader();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const { organization } = useSelector((state: any) => state.Login);


  const postAPI = async () => {
    let convertedDId = deviceId;
    convertedDId = convertedDId.replace(/(.{2})/g, "$1:");
    convertedDId = convertedDId.slice(0, -1);
    try {
      const res = await axios.post("http://47.32.254.89:7000/api/add", {
        deviceId: convertedDId,
        deviceName,
        organization
      });
      if (res.data.message === "Beacon details saved successfully..") {
        // window.location.reload();
        closeModal();
        setDeviceId("");
        setDeviceName("");
        getAPI();
      }else{
        closeModal();
        setDeviceId("");
        setDeviceName("");
        alert(res.data.message.description)
      }
    } catch (error) {
      console.log(error);
      closeModal()
      alert("something wrong..");
      setDeviceId("");
      setDeviceName("");
    }
  };
  const startScanning = async () => {
    try {
      setScanning(true);
      const videoInputDevices = await codeReader.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0].deviceId;
      const constraints = {
        video: { deviceId: selectedDeviceId },
      };
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result: any, err: any) => {
          if (result) {
            setScannedData(result.getText());
            setDeviceId(result.getText());
            setScanning(false);

            // Automatically open the modal
            handleClose()
            const modal = document.getElementById("exampleModal");
            if (modal) {
              modal.classList.add("show");
              modal.style.display = "block";
            }
          }
          if (err && err.name === "NotFoundError") {
            console.error("No QR code found in the video feed.");
          }
          if (err) {
            console.error("Error during scanning:", err);
          }
        },
      );
    } catch (error) {
      console.error("Error starting the scanner:", error);
    }
  };

  useEffect(() => {
    if (!scanning) return
    if (scanning) {
      startScanning();
    } else {
      codeReader.reset();
    }

    return () => {
      codeReader.reset();
    };
  }, [scanning]);

  const handleDeviceNameChange = (e: any) => {
    setDeviceName(e.target.value);
  };

  const closeModal = () => {
    const modal = document.getElementById("exampleModal");
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      setDeviceId("");
      setDeviceName("");
      setScannedData("");
      setScanning(!scanning);
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => { 
    setShow(false)
    setScanning(false)
    codeReader.reset()
  };
  const handleShow = () => {
      setShow(true);
      startScanning();
  };

const closeModalAndRec = () => {
  setShow(false)
  setScanning(false)
  codeReader.reset()
}

  return (
    <div >
      {
        forPC
        ? <React.Fragment>
            <TextField
              id="outlined-basic-1"
              label="DeviceId"
              variant="outlined"
              fullWidth
              value={scannedData}
              disabled
              onChange={onChange}
            />
            <IconButton
              style={{ position: 'absolute', right: '8px', transform: 'translateY(20%)' }}
              onClick={handleShow}
            >
              <FaQrcode style={{color:'#000'}} />
            </IconButton>
          </React.Fragment>
        : <Button style={{fontSize:'10px', width:'100px',height:'30px',backgroundColor: '#0f3995'}} label={scanning ? "Stop Scanning" : "Start Scanning"} onClick={handleShow} />
      }
      {
        !forPC &&
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add Device
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                >
                  <span aria-hidden="true">x</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="deviceName"
                    placeholder="Device Name"
                    value={deviceName}
                    onChange={handleDeviceNameChange}
                  />
                  <label htmlFor="deviceName">Device Name</label>
                </div>
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="deviceId"
                    placeholder="Device ID"
                    value={deviceId}
                    readOnly
                  />
                  <label htmlFor="deviceId">Device ID</label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={postAPI}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Scanning</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <video ref={videoRef} style={{ display: scanning ? "block" : "none", width: '100%', height: '400px' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button label={'Close'} variant="secondary" onClick={handleClose} >
          </Button>
          <Button label={scanning ? "Stop Scanning" : "Start Scanning"} style={{ backgroundColor: '#0f3995' }} onClick={closeModalAndRec}/>
        </Modal.Footer>
      </Modal>
     
    
    </div>
  );
};

export default Scan;