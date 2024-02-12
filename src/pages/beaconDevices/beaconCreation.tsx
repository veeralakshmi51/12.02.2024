import React, { useState,useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../configuration/url";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Tooltip,
  } from "@mui/material";
import { Modal, ModalFooter,ModalHeader } from "reactstrap";
import {Button} from 'primereact/button'
interface FormData {
  
    id: string;
    uuid: string;
    deviceName: string;
    deviceId:string;
    BeaconType: string;
    modelNumber: string;
    orgId: string;
  
}
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
interface BeaconCreationFormProps{
    modal:boolean,
    toggle:()=>void,
}
const initialFormData:FormData=({
  
    id:"", 
    uuid : '',
      deviceName : '',
      deviceId : '',
      BeaconType : '',
      modelNumber:'',
      orgId:"",
  
})
const BeaconCreation: React.FC <BeaconCreationFormProps>= ({modal,toggle}) => {
    const { organization } = useSelector((state: any) => state.Login)
    const navigate = useNavigate();
    const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);

    const [formValues, setFormValues] = useState<FormData>(initialFormData)
    const resetForm=()=>{
      setFormValues(initialFormData);
    }
    const handleSaveClick = async () => {
        const requestBody = {
            id: "",
            uuid: formValues.uuid,
            deviceName: formValues.deviceName,
            deviceId: formValues.deviceId,
            deviceType: formValues.BeaconType,
            modelNumber:formValues.modelNumber,
            orgId: organization,
        };
        try {
            if (!formValues.uuid || !formValues.deviceId || !formValues.deviceName ) {
                toast.error('Please fill the required fields');
                return;
            }
            const response = await axios.post(`${baseURL}/sensor/register`, requestBody)
            if(response.data.message && response.data.message.code === 'MHC - 0200') {
                toast.success(response.data.message.description);
                toggle();
                resetForm();
            } else {
                toast.warning(response.data.message.description);
            }
        } catch (error) {
            console.error("beaconCreate: ",error)
        }
    }

    const handleSelectChange = (fieldName: string, value: any) => {
        setFormValues({ ...formValues, [fieldName]: value });
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
              value={formValues[dropdownName as keyof FormData]}
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
     

    return(
        <Modal isOpen={modal} toggle={toggle} size="lg" centered style={{width:'580px'}}>
      <div className="d-flex align-items-center justify-content-center m-20">
      <div className="row w-100">
      <div className="container col-md-12">
      {/* <div className="d-flex justify-content-center align-items-center">
              <h4 className="mt-1">Beacon Registration</h4>
            </div> */}

            <ModalHeader toggle={toggle}>
                Beacon Registration
            </ModalHeader>
                
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'40px'}}>
                <div className="col-md-12 mb-2">
                        <TextField id="outlined-basic-1" label="Device Name" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, deviceName: e.target.value})} />
                </div>
                </div>
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                <div className="col-md-6 mb-2">
                        <TextField id="outlined-basic-1" label="Device Id" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, deviceId: e.target.value})} />
                </div>
                <div className="col-md-6 mb-2">
                        {/* <TextField id="outlined-basic-1" label="Device Type" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, deviceType: e.target.value})} /> */}
                        {renderDropdown('BeaconType')}
                </div>
                </div>
               
                
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                    <div className="col-md-6 mb-2">
                        <TextField id="outlined-basic-1" label="Unique Id" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, uuid: e.target.value})} />
                    </div>
                    <div className="col-md-6 mb-2">
                        <TextField id="outlined-basic-1" label="Model Number" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, modelNumber: e.target.value})} />
                    </div>
                </div>
               
                </div>
            
                <ModalFooter className="mb-3 mt-4">
                <div className="d-flex gap-3 justify-content-center mt-4">
                <Button label="Cancel" severity="secondary" style={{ color: '#000', backgroundColor: '#94a0b7', fontWeight:'bold'}} onClick={toggle}></Button>
                <Button label="Save Changes" style={{ backgroundColor: '#0f3995',fontWeight:'bold'}} onClick={handleSaveClick}></Button>
            </div>
          </ModalFooter>
        
        <ToastContainer/>
           
        </div>
        </div>
        </Modal>
    )
}

export default BeaconCreation;