import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from '../../configuration/url';
import { FaQrcode } from 'react-icons/fa';
import Scan from '../beaconDevices/Scan';
import { DatePicker } from '@mui/x-date-pickers';
import { formatDateToYYYYMMDD, formatSSN } from '../../helpers/common';
import { DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Col,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  CardFooter,
  CardHeader,
  Badge,
  Input,
  Button,
  Table
} from "reactstrap";
import { getAllPatient } from '../../slices/thunk';
import roomImage from './../../assets/images/roomImage.svg';
import bedImage from './../../assets/images/bedImage.jpg';
import patientImage from './../../assets/images/patientImage.png'
import {
  getAllBedAssign
} from "../../slices/bedAssign/thunk";
import { getAllBed } from "../../slices/patientAssign/thunk";

interface DropdownItem {
  id: string;
  value: string;
  type: string;
}

interface BedFormData {
  id: string;
  bedId: string;
  pid: string;
  orgId: string;
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
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  ssn: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  mrNumber: string;
  email: string;
  deviceId: string;
}
interface PatientCreationFormProps{
  modal:boolean;
  toggle:()=>void;
}
const PatientCreation: React.FC<PatientCreationFormProps> = ({modal,toggle}) => {
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
  const { organization } = useSelector((state: any) => state.Login);
  const [bedAssignDialog, setBedAssignDialog] = useState(false);
  const [patientAndBedAssign, setPatientAndBedAssign] = useState<any[]>([]);
  const { patientData, loading } = useSelector((state: any) => state.Patient);
  const dispatch = useDispatch<any>()
  const navigate = useNavigate();
  const [bedId, setBedId] = useState<string | null>(null);
  let [newAssignedBy, setAssignedBy] = useState<string | null>(null);
  const { bedAssignData = [] } = useSelector(
    (state: any) => state.BedAssign
  );
  let [bedSelected, setBedSelected] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<any>({
    gender: [],
    Country: [],
    state: []
  });

  const initFormData ={
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    ssn: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    mrNumber: '',
    email: '',
    deviceId: ''
  }

  const [formValues, setFormValues] = useState<FormData>(initFormData);
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const handleCancel = () => {
    setFormValues(initFormData);
    toggle();
  }
  

  const fetchPatientsandBedAssign = async () => {
    try {
      const response = await axios.get(
        `http://47.32.254.89:7000/api/Q15Bed/getByOrg/${organization}`
      );
    
      if (response.data.data && Array.isArray(response.data.data)) {                
        // console.log(JSON.stringify());
        setPatientAndBedAssign(response.data.data);
        // setPatientAndBedAssign(response.data.data.sort((a:any, b:any) => (parseInt(a.roomNo) > parseInt(b.roomNo)) ? 1 : -1));
      } else {
        console.error("Invalid data format for patients:", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPatientName = (patientId: string) => {
    console.log("patientData:", patientData);
   
    const selectedPatient = patientData.find((patient: any) => patient.id === patientId);
   
    console.log("selectedPatient:", selectedPatient);
   
    if (selectedPatient) {
      if (selectedPatient.name && selectedPatient.name.length > 0) {
        const { family, given } = selectedPatient.name[0];
        const fullName = `${given} ${family}`;
       
        console.log("patientName:", fullName);
        return fullName;
      } else if (selectedPatient.basicDetails && selectedPatient.basicDetails.length > 0) {
        const { family, given } = selectedPatient.basicDetails[0].name[0];
        const fullName = `${given} ${family}`;
        console.log("patientName (using basicDetails):", fullName);
        return fullName;
      }
    }
  console.warn(`Patient data issue for ID: ${patientId}`, selectedPatient);
    return "Unknown";
  };

  useEffect(() => {
    getAllBedAssign(dispatch, organization);
    getAllBed(dispatch, organization);
  }, [dispatch, organization]);

  useEffect(() => {
    fetchPatientsandBedAssign();
    setAssignedBy(window.localStorage.getItem("LoginData"));
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

  const handleSaveClick = async () => {
    if(!formValues.email){
      toast.error("Please Enter Email Address")
      return;
    } else if(!emailRegex.test(formValues.email)){
      toast.error("Invalid Email Address")
      return;
    }
    console.log("Organization:", organization);
    const requestBody = {
      id: "",
      active: "",
      resource: [
        {
          fullUrl: "",
          resourceType: ""
        }
      ],
      basicDetails: [
        {
          coding: [
            {
              system: "",
              code: "",
              display: ""
            }
          ],
          name: [
            {
              use: formValues.middleName,
              given: formValues.firstName,
              family: formValues.lastName,
            }
          ],
          gender: selectedValues.gender || '',
          birthDate: formValues.birthDate,
          mrNumber: formValues.mrNumber,
          ssn: formValues.ssn,
          profile: "",
          licenseId: "",
          confirmEmail: "",
          get_birthDate: [
            {
              extension: [
                {
                  url: ""
                }
              ]
            }
          ],
          maritalStatus: "",
          sexualOrientation: ""
        }
      ],
      email: formValues.email,
      organization,
      contact: [
        {
          address: [
            {
              addressLine1: formValues.addressLine1,
              addressLine2: formValues.addressLine2,
              city: formValues.city,
              state: selectedValues.state || '',
              postalCode: formValues.postalCode,
              country: selectedValues.Country || ''
            }
          ],
          motherName: "",
          firstName: "",
          lastName: "",
          homePhone: "",
          workPhone: "",
          mobilePhone: "",
          contactEmail: "",
          trustedEmail: "",
          emergency: [
            {
              relationShip: "",
              emergencyContact: "",
              emergencyPhone: ""
            }
          ],
          additionalAddress: [
            {
              addressUse: "",
              addressType: "",
              startDate: "",
              endDate: "",
              addressLine1: "",
              addressLine2: "",
              city: "",
              district: "",
              state: "",
              postalCodeNumber: "",
              Country: ""
            }
          ]
        }
      ],
      userType: "",
      employer: [
        {
          occupation: "",
          city: "",
          state: "",
          postalCode: "",
          Country: "",
          unassignedUSA: "",
          industry: "",
          addressLine1: "",
          addressLine2: ""
        }
      ],
      guardian: [
        {
          name: "",
          relationship: "",
          gender: "",
          address: [
            {
              addressLine1: "",
              addressLine2: "",
              city: "",
              state: "",
              postalCode: "",
              Country: ""
            }
          ],
          workPhone: "",
          email: ""
        }
      ],
      misc: [
        {
          dateDeceased: "",
          reason: ""
        }
      ],
      stats: [
        {
          languageDeclined: true,
          ethnicityDeclined: true,
          raceDeclined: true,
          language: "",
          ethnicity: "",
          race: "",
          familySize: 0,
          financialReviewDate: "",
          monthlyIncome: "",
          homeless: "",
          interpreter: "",
          migrant: "",
          referralSource: "",
          religion: "",
          vfc: ""
        }
      ],
      insurance: [
        {
          primary: [
            {
              planName: "",
              subscriber: "",
              effectivedate: "",
              relationship: "",
              policyNumber: "",
              birthDate: "",
              groupNumber: "",
              ss: "",
              subscriberEmployee: "",
              subscriberPhone: "",
              city: "",
              state: "",
              Country: "",
              zipCode: "",
              gender: "",
              subscriberAddress: [
                {
                  addressLine1: "",
                  addressLine2: "",
                  city: "",
                  state: "",
                  Country: "",
                  zipCode: ""
                }
              ],
              co_pay: "",
              acceptAssignment: "",
              title: "",
              seaddress: ""
            }
          ],
          secondary: [
            {
              insuranceDetails: {
                planName: "",
                subscriber: "",
                effectivedate: "",
                relationship: "",
                policyNumber: "",
                birthDate: "",
                groupNumber: "",
                ss: "",
                subscriberEmployee: "",
                subscriberPhone: "",
                city: "",
                state: "",
                Country: "",
                zipCode: "",
                gender: "",
                subscriberAddress: [
                  {
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    Country: "",
                    zipCode: ""
                  }
                ],
                co_pay: "",
                acceptAssignment: "",
                title: "",
                seaddress: ""
              }
            }
          ]
        }
      ],
      familyHealth: [
        {
          id: "",
          name: "",
          deceadsed: "",
          diabetes: "",
          disease: "",
          stroke: "",
          mentalIllness: "",
          cancer: "",
          unknown: "",
          other: ""
        }
      ],
      socialHistory: [
        {
          smoker: "",
          smokePerDay: 0,
          everSmoked: "",
          smokeYears: 0,
          quitYear: 0,
          quitIntrest: "",
          drinkAlcohal: "",
          recreationalDrugs: "",
          pastAlcohal: "",
          tabaccoUse: "",
          usingTime: 0,
          partner: "",
          sexInfection: "",
          caffine: "",
          migrantOrSeasonal: "",
          usePerDay: 0,
          occupation: "",
          maritalStatus: "",
          child: "",
          noOfChild: 0,
          childAge: [
            ""
          ],
          sexActive: ""
        }
      ],
      primaryCarePhysician: [
        {
          id: "",
          primaryCarePhysician: "",
          phoneNo: "",
          medicalClinicName: "",
          fax: "",
          clinicAddress: "",
          notifyprimaryCarePhysician: true,
          patientSignature: "",
          psDateTime: "",
          guardianSignature: "",
          gsDateTime: "",
          releaseOfInformation: "",
          informationDateTime: "",
          faxed: ""
        }
      ],
      deviceId: formValues.deviceId,
      devices: [
        {
          id: "",
          deviceId: "",
          companyName: "",
          brandName: "",
          gmdnPTName: "",
          snomedCTName: "",
          dateTime: "",
          batch: "",
          serialNumber: "",
          identificationCode: true,
          mriSaftyStatus: "",
          containsNRL: true,
          status: ""
        }
      ],
      password: "",
      username: ""

    };
    try {
      const response = await axios.post(`${baseURL}/patient/register`, requestBody);
      console.log('API response:', response.data);
      console.log('Request : ', requestBody)
      if (response.data.message && response.data.message.code === 'MHC - 0200') {        
        const requestBody = {
          bedId: bedId,
          pid: response.data.data.id,
          assignedBy: newAssignedBy,
          admitDate: new Date().toISOString().slice(0, 10).replace(/-/g, "")
        };
     
        console.log("Request Payload:", JSON.stringify(requestBody));
     
        try {
          const response = await axios.post(
            "http://47.32.254.89:7000/api/Q15Bed/assign",
            requestBody
          );
     
          console.log("API bedassign Response:", response.data);
     
          if (
            response.data.message &&
            response.data.message.code === "MHC - 0200"
          ) {
            alert(response.data.message.description);   
            getAllBedAssign(dispatch, organization);
            getAllBed(dispatch,organization)
            getAllPatient(dispatch, organization);
            toast.success(response.data.message.description)
            toggle()
          } else {
            console.error("Error:", response.data.message);
            alert(`Error: ${response.data.message.description}`);
          }       
        } catch (error) {
          console.error("API Request Error:", error);
          alert("An error occurred. Please check console for details.");
        } finally {  
        }
       
      } else {
        console.log('Request : ', requestBody)
        console.log('Error Registering:', response.data.message)
        toast.warning(`Error: ${response.data.message.description}`);
        //alert(`Error: ${response.data.message.description}`);


      }
    } catch (error) {
      // console.log('Request : ', requestBody)
      // console.error('Error:', error);
      console.log(requestBody)
    }
  };

  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    gender: false,
    Country: false,
  });



  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>, dropdownName: string) => {
    setSelectedValues({ ...selectedValues, [dropdownName]: e.target.value as string[] });
    setOpenState({ ...openState, [dropdownName]: false });
  };
  const selectedPatientId = patientData?.id;
  const [bedAssignedData, setBedAssignedData] = useState<BedFormData>({
    id: "",
    bedId: bedAssignData.bedId,
    pid: selectedPatientId || "",
    orgId: organization,
  });

  const handleClick = (selectedBed: any) => {
    setBedSelected(selectedBed.roomNo+"-"+selectedBed.bedNo);
    const bedAssignId = selectedBed.id || " ";
    setBedId(bedAssignId);
    // console.log(JSON.stringify(selectedBed));
    // if (selectedBed) {
   
    
   
    //   console.log("Bed Id:", bedAssignId);
    //   console.log("Clicked details", selectedBed);
    //   setBedAssignedData({
    //     id: selectedBed.id,
    //     bedId: selectedBed.bedId,
    //     pid: selectedBed.pid,
    //     orgId: selectedBed.orgId,
    //   });
    //   console.log("Responses:", selectedBed);
      setBedAssignDialog(false); 
    // } else {
    //   console.error("Invalid Data:", selectedBed);
    // }
  };

  const renderDropdown = (dropdownName: string) => {
    const dropdown = dropdownData.find((item) => item.dropdown === dropdownName);

    if (!dropdown) {
      return null;
    }
    const menuStyle={
      maxHeight:'250px'
    }
    return (
      <FormControl sx={{ marginLeft: '3px', width: '100%' }} key={dropdownName}>
        <InputLabel id={`demo-simple-name-label-${dropdownName}`}>{dropdownName}</InputLabel>
        <Select
          labelId={`demo-simple-name-label-${dropdownName}`}
          id={`demo-simple-name-${dropdownName}`}
          value={selectedValues[dropdownName]}
          onChange={(e: any) => handleSelectChange(e, dropdownName)}
          onClose={() => setOpenState({ ...openState, [dropdownName]: false })}
          onOpen={() => setOpenState({ ...openState, [dropdownName]: true })}
          open={openState[dropdownName]}
          input={<OutlinedInput label={dropdownName} />}
          MenuProps={{
            PaperProps:{
              style:menuStyle,
            }
          }}
        >
          {dropdown.list.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <>
    <Modal isOpen={modal} toggle={toggle} centered size='lg'>
      <div className="d-flex align-items-center justify-content-center vh-90">
      <div className='row'>
      <div className='container col-md-12'>

      <div className="d-flex justify-content-center align-items-center">
              <h3 className="mt-1">Patient Creation</h3>
            </div>
            <hr></hr>
        <div className="row w-100 " style={{ marginTop: '10px' }}>
          <div className='col-md-4 mb-2'>
            <TextField id="outlined-basic-1" label="First Name" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, firstName: e.target.value })} />
          </div>
          <div className='col-md-4 mb-2'>
            <TextField id="outlined-basic-2" label="Middle Name" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, middleName: e.target.value })} />
          </div>
          <div className='col-md-4 mb-2'>
            <TextField id="outlined-basic-3" label="Last Name" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, lastName: e.target.value })} />
          </div>
        </div>

        <div className="row w-100">
          <div className='col-md-4 mb-2'>
            {renderDropdown('gender')}
          </div>
          <div className='col-md-4 mb-2' >
            {/* <TextField id="outlined-basic-2" label="Date of Birth" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, birthDate: e.target.value })} /> */}
            <DatePicker
              label={'Date Of Birth'}
              format='DD-MM-YYYY'
              onChange={(date: any) =>{
                console.log(formatDateToYYYYMMDD(date))
                setFormValues({ ...formValues, birthDate: formatDateToYYYYMMDD(date) })
              }}
            />
          </div>
          <div className='col-md-4 mb-2'>
            <TextField id="outlined-basic-2" label="MrNumber" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, mrNumber: e.target.value })} />
          </div>
        </div>
        <div className='row w-100'>
        <div className='col-md-6 mb-2'>
            <TextField id="outlined-basic-1" label="SSN" variant="outlined" value={formatSSN(formValues.ssn)} fullWidth onChange={(e) => setFormValues({ ...formValues, ssn: e.target.value })} />
          </div>
          <div className='col-md-6 mb-2'>
            <TextField id="outlined-basic-1" label="Email" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} />
          </div>
        </div>
        
        <div className="row w-100 ">
       
          <div className='col-md-6 mb-2'>
            <TextField id="outlined-basic-1" label="Address Line 1" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, addressLine1: e.target.value })} />
          </div>
          <div className='col-md-6 mb-2'>
            <TextField id="outlined-basic-2" label="Address Line 2" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, addressLine2: e.target.value })} />
          </div>
        </div>

        <div className="row w-100 ">
          <div className='col-md-4 mb-2'>
            <TextField id="outlined-basic-1" label="City" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, city: e.target.value })} />
          </div>
          <div className='col-md-4 mb-2'>
            {/* <TextField id="outlined-basic-2" label="State/Provide" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, state: e.target.value })} /> */}
            {renderDropdown('state')}
          </div>
          <div className='col-md-4 mb-2'>
            <TextField id="outlined-basic-3" label="Zip/Postal Code" variant="outlined" fullWidth onChange={(e) => setFormValues({ ...formValues, postalCode: e.target.value })} />
          </div>
        </div>

        <div className="row w-100 ">
          <div className='col-md-6 mb-2'>
            {renderDropdown('Country')}
          </div>
          <div className="col-md-6 mb-2" style={{ position: 'relative' }}>
            <Scan forPC />
          </div>
          
        </div>
        <div className="row w-100 ">
        <div className='col-md-6 mb-2' style={{textAlign:'end'}}>
        <><TextField label="Room-Bed" type="text" placeholder='' margin="none" fullWidth value={bedSelected? bedSelected:""} disabled={true} onChange={(e)=>e.target.value} /><a style={{cursor:'pointer', color:'blue'}} onClick={()=>{setBedAssignDialog(true)}}>{bedSelected !== null && bedSelected !== undefined && bedSelected !== "" ? "Change":"Click here to which bed patient will admit" } </a></>
          </div>
          <div className='col-md-6 mb-2'>            
          </div>       
          </div>

<br></br>
          <ModalFooter>
          <div className="d-flex gap-3 justify-content-end mt-4">

            <Button onClick={handleCancel} className='btn-danger'>Cancel</Button>
            <Button onClick={handleSaveClick} className='btn-info'>Save Changes</Button>
            </div>
          </ModalFooter>
          
        <ToastContainer />
      </div>
      </div>
    </div>
    </Modal>  
  <Dialog maxWidth={'md'} PaperProps={{ sx: { width: '100%', maxWidth: '90%', position: 'absolute', height: '100%', top: '1px', maxHeight: '100%',overflow:'hidden' } }}
                                open={bedAssignDialog}
                                onClose={() => setBedAssignDialog(false)}
                              >
                                <DialogTitle>All Beds</DialogTitle>
                                <DialogContentText >
                                  <DialogContent style={{ padding: '25px', overflowX: 'hidden', background: '#F8FAFB', height: "643px" }}>
                                    <div>
                                  <Row style={{ display: "flex", flexWrap: "wrap", justifyContent:'space-evenly' }}>
            {Array.isArray(patientAndBedAssign) && patientAndBedAssign.length > 0 ? (
              patientAndBedAssign.map((bedassign: any, index: number) => (
               bedassign.pid !== null ? <>
                <Col key={bedassign.id} style={{flex: 0, padding:0 }}>
                <div className="bed-assignment-box">
                <Card
                      className="mb-3"
                      color="danger"
                      outline
                      style={{
                        width: "96px",
                        height: "135px",
                        margin: "5px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <CardBody
                        key={index}
                        className="mb-2"                      
                        style={{ padding:'0.6rem' }}
                      >
                        <CardTitle tag="h6">
                        <img src={roomImage} style={{width:'30px',height:'35px'}}></img> <span style={{fontSize:'16px',fontWeight:'bold'}}>{bedassign.roomNo}</span>
                        </CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">
                        <img src={bedImage} style={{width:'30px',height:'35px'}}></img> <span style={{fontSize:'16px',fontWeight:'bold'}}>{bedassign.bedNo}</span>
                        </CardSubtitle>
                      </CardBody>
 
                      <CardFooter style={{padding:'0.2rem', position:'relative', display:'flex', top:'-13px', height:'35px',fontSize:'12px', fontWeight:'bold',lineHeight:'normal'}}>
                      <img src={patientImage} style={{width:'22px',height:'22px'}}></img><span style={{paddingLeft:'5px'}}>{getPatientName(bedassign.pid)}</span>                       
                      </CardFooter>
                    </Card>                
                </div>
              </Col>            
                </>:<> 
                <Col key={index} style={{flex: 0, padding:0 }}>
                  <div className="bed-assignment-box">
                    <Card
                      className="mb-3"
                      color="primary"
                      outline
                      style={{
                        width: "96px",
                        height: "135px",
                        margin: "5px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <CardBody
                        key={index}
                        className="mb-2"
                        onClick={() => handleClick(bedassign)}
                        style={{ cursor: "pointer", padding:'0.6rem' }}
                      >
                        <CardTitle tag="h6">
                        <img src={roomImage} style={{width:'30px',height:'35px'}}></img> <span style={{fontSize:'16px',fontWeight:'bold'}}>{bedassign.roomNo}</span>
                        </CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">
                        <img src={bedImage} style={{width:'30px',height:'35px'}}></img> <span style={{fontSize:'16px',fontWeight:'bold'}}>{bedassign.bedNo}</span>
                        </CardSubtitle>
                      </CardBody>
 
                      <CardFooter style={{padding:'0.6rem', position:'relative', top:'-13px', height:'35px',paddingTop:'5px',paddingLeft:'13px'}}>
                        <Badge
                          color={bedassign.pid ? "danger" : "success"}
                          tag="h4"
                        >
                          {bedassign.pid ? "Not Available" : "Available"}
                        </Badge>
                        {/* <FontAwesomeIcon
                          icon={faTrash}
                          className="text-danger outline"
                          onClick={() => handleDelete(bedassign.id)}
                          style={{ cursor: "pointer", marginLeft: "20%" }}
                        /> */}
                      </CardFooter>
                    </Card>
                  </div>
                </Col></>
              ))
            ) : (
              <p>No bed assignments available.</p>
            )}
          </Row></div>
                                  </DialogContent>
                                </DialogContentText>
                              </Dialog>
  </>
  );
};

export default PatientCreation;