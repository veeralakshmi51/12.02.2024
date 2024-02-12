import React, { useEffect } from "react";
import  TextField  from "@mui/material/TextField";
import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updatePatientDetails } from "../../slices/thunk";
import { Button } from 'primereact/button'
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { formatDateToYYYYMMDD } from "../../helpers/common";

interface FormData {
  id:string;
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
  gender: string;
  country: string;
  active:string;
  organization:string;
}
const PatientUpdation = () => {
  
  const { patientData} = useSelector((state: any) => state.Patient);
  const { organization } = useSelector((state: any) => state.Login);
  const navigate = useNavigate();
  const location=useLocation();
  const params = useParams()
const {state:patient}=location;
  const [formData, setFormData] = useState<FormData>({
    id:"",
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    ssn: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    mrNumber:"",
    email: "",
    deviceId: "",
    gender: "",
    country: "",
    active:"",
    organization:"",
    
  });
  useEffect(()=>{
    if(location.state){
      setFormData({
        id:location.state?.id||"",
        firstName:location.state?.basicDetails[0]?.name[0]?.given||"",
        middleName:location.state?.basicDetails[0]?.name[0]?.use||"",
        lastName:location.state?.basicDetails[0]?.name[0]?.family||"",
        birthDate:location.state?.basicDetails[0]?.birthDate||"",
        ssn:location.state?.basicDetails[0]?.ssn||"",
        addressLine1:location.state?.contact[0]?.address[0]?.addressLine1||"",
        addressLine2: location.state?.contact[0]?.address[0]?.addressLine2||"",
        city: location.state?.contact[0]?.address[0]?.city||"",
        state: location.state?.contact[0]?.address[0]?.state||"",
        postalCode: location.state?.contact[0]?.address[0]?.postalCode||"",
        mrNumber:location.state?.basicDetails[0]?.mrNumber||"",
        email: location.state?.email||"",
        deviceId: location.state?.beaconDevice||"",
        gender: location.state?.basicDetails[0]?.gender||"",
        country: location.state?.contact[0]?.address[0]?.country||"",
        active:location.state?.active||"",
        organization:location.state?.organization||"",

      })
    }
  },[location.state])
  const dispatch = useDispatch<any>();
  const [selectPatientId, setSelectPatientId] = useState<string | null>(null);
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // useEffect(()=>{
  //   getPatientById(dispatch,organization)
  // },[dispatch,organization])
  const handleSaveChanges = () => {
    console.log("Form Data:", formData);
    console.log('Selected patient ID:',params?.id)
    if (!params.id) {
      console.error("Selected Patient ID is not found");
      return;
    }
    const updatedPatientFields = {
      id: params?.id,
      basicDetails: [
        {
          name: [
            {
              use: formData.middleName,
              given: formData.firstName,
              family: formData.lastName,
            },
          ],
          ssn: formData.ssn,
          mrNumber: formData.mrNumber,
          gender: formData.gender,
          birthDate: formData.birthDate,
        },
      ],
      email: formData.email,
      organization,
      contact: [
        {
          address: [
            {
              addressLine1: formData.addressLine1,
              addressLine2: formData.addressLine2,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
              country: formData.country,
            },
          ],
        },
      ],
      beaconDevice: formData.deviceId,
    };
    console.log("Before Update:", patientData);
    dispatch(
      updatePatientDetails(
        params?.id,
        updatedPatientFields,
       organization,
      )
    );

    console.log("After Update:", updatedPatientFields);
    alert('Patient Details Updated Successfully');
    navigate('/patient-table')
  };
  return(

    <div className='row w-100'>
    <div className='col-md-2'></div>
    <div className='col-md-8'>
    <h4 className='mb-2 text-center' >Patient Details Update Here!</h4>
    <hr></hr>
    <div className="row w-100 " style={{marginTop:'10px'}}>
          <div className='col-md-4 mb-3'>
            <TextField id="outlined-basic-1" label="First Name" variant="outlined" fullWidth onChange={handleChange} value={formData.firstName} name="firstName"/>
          </div>
          <div className='col-md-4 mb-3'>
            <TextField id="outlined-basic-2" label="Middle Name" variant="outlined" fullWidth onChange={handleChange} value={formData.middleName} name="middleName" />
          </div>
          <div className='col-md-4 mb-3'>
            <TextField id="outlined-basic-3" label="Last Name" variant="outlined" fullWidth onChange={handleChange} value={formData.lastName} name="lastName"/>
          </div>
        </div>

        <div className="row w-100">
        <div className='col-md-4 mb-3'>
            {/* <TextField id="outlined-basic-2" label="Date of Birth" variant="outlined"  fullWidth onChange={handleChange} value={formData.birthDate} name="birthDate"/> */}
            <DatePicker
              label={'Date Of Birth'}
              format='DD-MM-YYYY'
              value={dayjs(formData.birthDate)}
              onChange={(date: any) => {
                setFormData({ ...formData, birthDate: formatDateToYYYYMMDD(date) })
              }}
            />
          </div>
          <div className='col-md-4 mb-3'>
            <TextField id="outlined-basic-1" label="SSN" variant="outlined" fullWidth onChange={handleChange} value={formData.ssn} />
          </div>
          <div className='col-md-4 mb-3'>
            <TextField id="outlined-basic-1" label="Email" variant="outlined" fullWidth onChange={handleChange} value={formData.email} />
          </div>
        </div>

        <div className="row w-100 ">
          
          <div className='col-md-6 mb-3'>
            <TextField id="outlined-basic-2" label="MrNumber" variant="outlined" fullWidth onChange={handleChange }  value={formData.mrNumber} name="mrNumber"/>
          </div>
          <div className='col-md-6 mb-3'>
            <TextField id="outlined-basic-2" label="DeviceId" variant="outlined" fullWidth onChange={handleChange} value={formData.deviceId} name="deviceId"/>
          </div>
        </div>

        <div className="row w-100 ">
          <div className='col-md-6 mb-3'>
            <TextField id="outlined-basic-1" label="Address Line 1" variant="outlined" fullWidth onChange={handleChange} value={formData.addressLine1} name="addressLine1"/>
          </div>
          <div className='col-md-6 mb-3'>
            <TextField id="outlined-basic-2" label="Address Line 2" variant="outlined" fullWidth onChange={handleChange} value={formData.addressLine2} name="addressLine2"/>
          </div>
        </div>

        <div className="row w-100 ">
          <div className='col-md-4 mb-2'>
            <TextField id="outlined-basic-1" label="City" variant="outlined" fullWidth onChange={handleChange} value={formData.city} name="city"/>
          </div>
          <div className='col-md-4 mb-2'>
            <TextField id="outlined-basic-2" label="State/Provide" variant="outlined" fullWidth onChange={handleChange} value={formData.state} name="state"/>
          </div>
          <div className='col-md-4 mb-2'>
            <TextField id="outlined-basic-3" label="Zip/Postal Code" variant="outlined" fullWidth onChange={handleChange} value={formData.postalCode} name="postalCode"/>
          </div>
        </div>

      

        <div className="row w-100 ">
         
        </div>
        <div className="d-flex gap-3 justify-content-end mt-4">
        <Button label="Cancel"  onClick={() => { navigate(-1) }} severity="secondary" style={{color:'#000',backgroundColor:'#fff', border:'2px solid #0f3995'}}/>
            <Button label="Save" style={{ backgroundColor: '#0f3995' }} onClick={handleSaveChanges} />

        </div>
        </div>
</div>
  )
};

export default PatientUpdation;
