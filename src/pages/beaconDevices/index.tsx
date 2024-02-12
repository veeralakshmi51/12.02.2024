import axios from "axios";
import React, { useEffect, useState } from "react";
import "./beacon.css";
import Scan from "./Scan";
import { Pagination } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { baseURL } from "../../configuration/url";
import { TbDeviceWatchPlus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { updatedSensorDetails } from "../../slices/beaconDevices/thunk";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import {Button} from 'primereact/button';
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import BeaconCreation from "./beaconCreation";
interface DropdownItem {
  id: string;
  value: string;
  type: string;
}

interface Dropdown {
  id: string;
  dropdown: string;
  list: DropdownItem[];
}

interface DropdownResponse {
  message: {
    code: string;
    description: string;
  };
  data: Dropdown[];
}

interface FormData {
  id:string;
    uuid : string;
    deviceName : string;
    deviceId : string;
    BeaconType : string; 
    modelNumber:string;
    orgId:string
}
const QRCodeScanner: React.FC = () => {
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [selecSensorId, setSelectSensorId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch<any>();
  const itemsPerPage = 10;
  const { organization } = useSelector((state: any) => state.Login);
  const { beaconData } = useSelector((state: any) => state.Beacon);
  const [modal,setModal]=useState(false);
  const toggle=()=>{
    setModal(!modal);
  }
  const [sensorData, setSensorData] = useState({
    id: "",
    uuid: "",
    deviceId: "",
    deviceName: "",
    BeaconType: "",
    modelNumber:'',
    orgId: organization,
  });

  

  const handleSelectChange = (fieldName: string, value: any) => {
    setSensorData({ ...sensorData, [fieldName]: value });
  };

  const getAPI = async (dispatch: any, organization: string) => {
    try {
      const res = await axios.get(
        `${baseURL}/sensor/getAllByorgId/${organization}`
      );
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    deviceType:false,
  });
  
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch(`${baseURL}/dropdowns/get-all`);
        const data: DropdownResponse = await response.json();
        if (data && data.message && data.message.code === 'MHC - 0200') {
          setDropdownData(data.data);
          console.log('Fetched data:', data.data);
        } else {
          console.error('Error fetching dropdown data:', data.message.description);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  const renderDropdown = (dropdownName: string) => {
    const dropdown = dropdownData.find((item) => item.dropdown === dropdownName);
  
    if (!dropdown) {
      return null;
    }
  
    const menuStyle = {
      maxHeight: "250px",
    };
  
    return (
      <FormControl sx={{ marginLeft: "3px", width: "100%" }} key={dropdownName}>
        <InputLabel id={`demo-simple-name-label-${dropdownName}`}>
          {dropdownName}
        </InputLabel>
        <Select
          labelId={`demo-simple-name-label-${dropdownName}`}
          id={`demo-simple-name-${dropdownName}`}
          value={sensorData[dropdownName as keyof FormData]}
          onChange={(e: any) => handleSelectChange(dropdownName, e.target.value)}
          onClose={() => setOpenState({ ...openState, [dropdownName]: false })}
          onOpen={() => setOpenState({ ...openState, [dropdownName]: true })}
          open={openState[dropdownName]}
          input={<OutlinedInput label={dropdownName} />}
          MenuProps={{
            PaperProps: {
              style: menuStyle,
            },
          }}
        >
          {dropdown.list.map((item: any) => (
            <MenuItem key={item.id} value={item.value}>
              {item.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };
  const deleteAPI = async (deviceName: any) => {
    const del = window.confirm(`Do you want to delete this data?  ${deviceName}`);
    if (del) {
      try {
        const res = await axios.delete(
          `${baseURL}/sensor/deleteByDeviceName/${deviceName}`
        );
        toast.success("Your data has been deleted successfully.");
        getAPI(dispatch, organization);
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("You declined the delete request.");
    }
  };

  useEffect(() => {
    getAPI(dispatch, organization);
  }, [dispatch, organization]);



  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentData = data
    .filter(
      (item: any) =>
        item.uuid?.toLowerCase().includes(search.toLowerCase()) ||
        item.deviceId?.toLowerCase().includes(search.toLowerCase()) ||
        item.deviceType?.toLowerCase().includes(search.toLowerCase()) ||
        item.deviceName?.toLowerCase().includes(search.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);
  const navigate = useNavigate();

  const handleSave = async () => {
    const updateFields = {
      id: sensorData.id,
      uuid: sensorData.uuid,
      deviceId: sensorData.deviceId,
      deviceName: sensorData.deviceName,
      deviceType: sensorData.BeaconType,
      modelNumber:sensorData.modelNumber,
      orgId: organization,
    };

    setSensorData((prevData) => ({
      ...prevData,
      ...updateFields,
    }));

    try {
      await updatedSensorDetails(
        dispatch,
        sensorData.id,
        updateFields,
        organization
      );

      setEditModal(false);
      getAPI(dispatch,organization)
    } catch (error) {
      console.error("Error updating sensor details:", error);
    }
  };

  const handleClick = (selectSensor: any) => {
    if (selectSensor) {
      setSensorData({
        id: selectSensor?.id,
        uuid: selectSensor?.uuid || "",
        deviceId: selectSensor?.deviceId || "",
        deviceName: selectSensor?.deviceName || "",
        BeaconType: selectSensor?.deviceType || "",
        modelNumber:selectSensor?.modelNumber||"",
        orgId: organization,
      });
      setEditModal(true);
    } else {
      console.log("Invalid data", selectSensor);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearch(value);
  };
  const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSensorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div className="container ">
      
      <div className="row">
        <div className="col-md-4"><h4>Beacon List</h4></div>
        <div className="col-md-8 d-flex flex-row justify-content-end gap-2">
        <div className="row gap-1 p-0">
       
        <div className="col-md-4">
        <div className="mx-0 search-container d-flex align-items-center">
              <input
                type="text"
                placeholder="Search..."
                className="search form-control"
                onChange={handleChange}
                style={{ fontSize: "10px", width:'130px',height:'30px' }}
              />
              <FaSearch className="search-icon" style={{ fontSize: "10px" }}/>
            </div>
        </div>
        <div className="col-md-3 d-flex flex-row">
          <Scan getAPI={getAPI} />
          <p style={{fontSize:'12px',marginLeft:'2px',display:'flex',alignItems:'center'}}>(or)</p>
        </div>
        <div className="col-md-4">
        <button
            className="btn btn-outline-primary floflat-end d-flex gap-2 align-items-center"
            style={{fontSize:'10px', width:'150px',height:'30px'}}
            onClick={toggle}
          >
            <TbDeviceWatchPlus
              style={{ cursor: "pointer", fontSize: "20px" }}
            />{" "}
            Add a New Beacon
          </button>
        </div>
        </div> 
        </div>       
      </div>
      <br />
      <div className="row mb-2 d-flex ">
        <hr></hr>
        
        <table className="table table-bordered" style={{fontSize: '13px'}}>
        <thead style={{ backgroundColor: "#F8FAFB" }}>
            <tr>
              <th scope="col" className="text-center" style={{ fontSize: '13px', color: "rgba(0, 0, 0, 0.5)" }}>Id</th>
              <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Device Name</th>
              <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Device Id</th>
              <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Device Type</th>
              <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Unique-Id</th>
              <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Model Number</th>
              <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Action</th>
            </tr>
          </thead>
          <tbody className="tbody">
            {currentData.map((item: any, index: any) => (
              <tr key={item.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(item)}>
                  {item.deviceName}
                </td>
                <td>{item.deviceId}</td>
                <td>{item.deviceType}</td>
                <td>{item.uuid}</td>
                <td>{(item.modelNumber) ? item.modelNumber : 'NA'}</td>
                <td className="text-center d-flex justify-content-around align-items-center">
                <Tooltip title="Edit" arrow>
                    <FontAwesomeIcon
                        icon={faPencil}
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick(item)}
                      />
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger"
                    onClick={() => deleteAPI(item.deviceName)}
                    style={{ cursor: "pointer" }}
                  />
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <BeaconCreation modal={modal} toggle={toggle}/>

      </div>
      <div className="d-flex justify-content-center">
            <Pagination>
              {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map(
                (_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                )
              )}
            </Pagination>
          </div>
          <Modal isOpen={editModal} toggle={() => setEditModal(false)} centered size="lg" style={{width:'600px'}}>
          <div className="d-flex justify-content-start align-items-center">
              <h4 className="mt-1">Beacon Details</h4>
            </div>
            <hr className="mt-3"></hr>
        <ModalBody>
        <div className="d-flex align-items-center justify-content-center vh-90">
      <div className="row w-100">
      <div className="container col-md-12">
              <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                <div className="col-md-12 mb-2">
                        <TextField id="outlined-basic-1" label="Device Name" variant="outlined" fullWidth onChange={handleChange1} value={sensorData.deviceName} name="deviceName"/>
                </div>
                </div>
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                <div className="col-md-6 mb-2">
                        <TextField id="outlined-basic-1" label="Device Id" variant="outlined" fullWidth onChange={handleChange1} value={sensorData.deviceId}/>
                </div>
                <div className="col-md-6 mb-2">
                        {/* <TextField id="outlined-basic-1" label="Device Type" variant="outlined" fullWidth onChange={handleChange1} value={sensorData.deviceType} name="deviceType"/> */}
                {renderDropdown('BeaconType')}
                </div> 
                
                </div>
               
                
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                    <div className="col-md-6 mb-2">
                        <TextField id="outlined-basic-1" label="Unique Id" variant="outlined" fullWidth onChange={handleChange1} value={sensorData.uuid} name="uuid"/>
                    </div>
                    <div className="col-md-6 mb-2">
                        <TextField id="outlined-basic-1" label="Model Number" variant="outlined" fullWidth onChange={handleChange1} value={sensorData.modelNumber?sensorData.modelNumber:'N/A'} name="modelNumber"/>
                    </div>
                </div>
                
                </div>   
        </div>
        </div>
        </ModalBody>
        <ModalFooter>
        <div className="d-flex gap-3 justify-content-center mt-4">
                <Button label="Cancel" severity="secondary" style={{ color: '#000', backgroundColor: '#94a0b7', fontWeight:'bold'}} onClick={()=>setEditModal(false)}></Button>
                <Button label="Save Changes" style={{ backgroundColor: '#0f3995',fontWeight:'bold'}} onClick={handleSave}></Button>
            </div>
         
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default QRCodeScanner;