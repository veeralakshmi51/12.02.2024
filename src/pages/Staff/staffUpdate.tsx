import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from 'primereact/button';
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './staff.css'
import { DatePicker } from '@mui/x-date-pickers';
import { formatDateToYYYYMMDD, formatPhoneNumber } from '../../helpers/common';
import { updateStaffDetails } from '../../slices/thunk';
import dayjs from 'dayjs';
import Loader from '../../components/loader/Loader';

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

const StaffUpdation = () => {
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
  const location = useLocation()
  const params = useParams<any>()
  const dispatch = useDispatch<any>()
  const { organization } = useSelector(
    (state: any) => state.Login
  );
  const { loading } = useSelector(
    (state: any) => state.Staff
  );
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    middleName: " ",
    lastName: " ",
    dateofBirth: " ",
    ssn: " ",
    npi: " ",
    addressLine1: " ",
    addressLine2: " ",
    city: " ",
    state: " ",
    postalcode: " ",
    mobilePhone: " ",
    email: " ",
    gender: " ",
    country: " ",
    role: " ",
    speciality: "",
    startDate: " ",
    active: " ",
    userType: "",
    organization: "",
  });

  const [selectedValues, setSelectedValues] = useState<any>({
    gender: formData.gender,
    country: formData.country,
    roles: formData.role,
    speciality: formData.speciality
  });
  useEffect(() => {
    if (location.state) {
      setFormData({
        id: location.state?.id || "",
        firstName: location.state?.name[0]?.given || "",
        middleName: location.state?.name[0]?.use || "",
        lastName: location.state?.name[0]?.family || "",
        dateofBirth: location.state?.dateofBirth || "",
        ssn: location.state?.ssn || "",
        npi: location.state?.npi || "",
        addressLine1: location.state?.contact[0]?.address[0]?.addressLine1 || "",
        addressLine2: location.state?.contact[0]?.address[0]?.addressLine2 || "",
        city: location.state?.contact[0]?.address[0]?.city || "",
        state: location.state?.contact[0]?.address[0]?.state || "",
        postalcode: location.state?.contact[0]?.address[0]?.zip || "",
        mobilePhone: location.state?.contact[0]?.mobilePhone || "",
        email: location.state?.email || "",
        gender: location.state?.gender || "",
        country: location.state?.contact[0]?.address[0]?.country || "",
        role: location.state?.role || "",
        speciality: location.state?.speciality || "",
        startDate: location.state?.startDate || "",
        active: location.state?.active || "",
        userType: location.state?.userType || "",
        organization: location.state?.organization || ""
      });
    }
  }, [location.state]);

  useEffect(() => {
    setSelectedValues({
      gender: location.state?.gender || "",
      country: location.state?.contact[0]?.address[0]?.country || "",
      roles: location.state?.role || "",
      speciality: location.state?.speciality || "",
    })
  }, [location.state])

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await fetch('http://47.32.254.89:7000/api/dropdowns/get-all');
        const data: DropdownResponse = await response.json();
        if (data && data.message && data.message.code === 'MHC - 0200') {
          setDropdownData(data.data);
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
    const requestBody = {
      id: formData.id,
      active: formData.active,
      name: [
        {
          use: formData.middleName,
          given: formData.firstName,
          family: formData.lastName,
        },
      ],
      gender: formData.gender || '', 
      email: formData.email,
      role: selectedValues.roles || '',
      organization,
      userType: formData.userType,
      startDate: formData.startDate,
      speciality: [
        formData.speciality[0] || ''
      ],
      dateofBirth: formData.dateofBirth,
      ssn: formData.ssn,
      npi: formData.npi,
      contact: [
        {
          address: [{
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            country: formData.country || '',
            state: formData.state,
            zip: formData.postalcode
          }],
          mobilePhone: formData.mobilePhone
        }
      ]
    };

    dispatch(updateStaffDetails(params?.id, requestBody, organization, navigate))
  };

  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    gender: false,
    country: false,
    roles: false,
    speciality: false,
  });

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>, dropdownName: string) => {
    setSelectedValues({ ...selectedValues, [dropdownName]: e.target.value as string });
    setOpenState({ ...openState, [dropdownName]: false }); 
  };

  const renderDropdown = (dropdownName: string) => {
    const dropdown: any = dropdownData.find((item) => item.dropdown === dropdownName);

    if (!dropdown) {
      return null;
    }
    const selectedValue = selectedValues[dropdownName];
    const sDrop = dropdown.list.filter((item: any) => item.value === selectedValue)

    const menuStyle = {
      maxHeight: '250px', 
    };
    return (
      <FormControl sx={{ marginLeft: '3px', width: '100%' }} key={dropdownName}>
        <InputLabel id={`demo-simple-name-label-${dropdownName}`}>{dropdownName}</InputLabel>
        <Select
          labelId={`demo-simple-name-label-${dropdownName}`}
          id={`demo-simple-name-${dropdownName}`}
          value={sDrop[0]?.id ?? formData[dropdownName as keyof typeof formData]}
          onChange={(e: any) =>{
            setFormData({...formData, [dropdownName]: e.target.value})
            handleSelectChange(e, dropdownName) 
          }}
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
            <MenuItem key={item.id} value={item.id}>
              {item.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };



  return (
    <div className='row w-100'>
      { loading && <Loader /> }
      <div className='col-md-2'></div>
      <div className='col-md-8'>
        <h4 className='mb-2 text-center' >Staff Details</h4>
        <hr></hr>

        <div className="row w-100 " style={{ marginTop: '10px' }}>
          <div className='col-md-4 mb-2'>
            <TextField
              id="outlined-basic-1" 
              label="First Name" 
              variant="outlined" 
              fullWidth 
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
            />
          </div>
          <div className='col-md-4 mb-2'>
            <TextField
              id="outlined-basic-2" 
              label="Middle Name" 
              variant="outlined" 
              fullWidth 
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} 
            />
          </div>
          <div className='col-md-4 mb-2'>
            <TextField 
            id="outlined-basic-3" 
            label="Last Name" 
            variant="outlined" 
            fullWidth 
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
          />
          </div>
        </div>

        <div className="row w-100">
          <div className='col-md-4 mb-2'>
            {renderDropdown('gender')}
          </div>
          <div className='col-md-4 mb-2'>
            <DatePicker
              label={'Date Of Birth'}
              format='DD-MM-YYYY'
              value={dayjs(formData.dateofBirth)}
              onChange={(date: any) => {
                setFormData({ ...formData, dateofBirth: formatDateToYYYYMMDD(date) })
              }}
            />
          </div>
          <div className='col-md-4 mb-2'>
            <TextField 
              id="outlined-basic-2" 
              label="Phone Number" 
              variant="outlined" 
              fullWidth 
              value={formatPhoneNumber(formData.mobilePhone)}
              onChange={(e) => setFormData({ ...formData, mobilePhone: e.target.value })}
            />
          </div>
        </div>

        <div className="row w-100 ">
          <div className='col-md-6 mb-2'>
            <TextField
            id="outlined-basic-1" 
            label="Email" 
            variant="outlined" 
            fullWidth 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />
          </div>
          <div className='col-md-6 mb-2'>
            {/* <TextField id="outlined-basic-2" label="User Type" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, userType: e.target.value })}/> */}

            <FormControl fullWidth>
              <InputLabel >UserType</InputLabel>
              <Select
                value={formData.userType}
                label="User Type"
                onChange={(e) => setFormData({ ...formData, userType: e.target.value })} 
              >
                <MenuItem value={'Admin'}>Admin</MenuItem>
                <MenuItem value={'System Admin'}>System Admin</MenuItem>
                <MenuItem value={'Staff'}>Staff</MenuItem>
              </Select>
            </FormControl>

          </div>
          </div>
          <div className='row w-100'> 
          <div className='col-md-6 mb-2'>
            <TextField
              id="outlined-basic-1"
              label="SSN" 
              variant="outlined" 
              fullWidth
              value={formData.ssn}
              onChange={(e) => setFormData({ ...formData, ssn: e.target.value })} 
              />
          </div>
          <div className='col-md-6 mb-2'>
            <TextField 
              id="outlined-basic-2" 
              label="NPI#" 
              variant="outlined" 
              fullWidth 
              value={formData.npi}
              onChange={(e) => setFormData({ ...formData, npi: e.target.value })} 
            />
          </div>
        </div>

        <div className="row w-100 ">
          
          <div className='col-md-6 mb-2'>
            {renderDropdown('speciality')}

          </div>
          <div className='col-md-6 mb-2'>
            {renderDropdown('roles')}
          </div>
        </div>

        <div className="row w-100 ">
          <div className='col-md-4 mb-2'>
            <TextField
              id="outlined-basic-1"
              label="Address Line 1"
              variant="outlined" 
              fullWidth 
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} 
            />
          </div>
          <div className='col-md-4 mb-2'>
            <TextField 
              id="outlined-basic-2" 
              label="Address Line 2" 
              variant="outlined" 
              fullWidth 
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} 
            />
          </div>
          <div className='col-md-4 mb-2'>
            {renderDropdown('Country')}
          </div>
        </div>

        <div className="row w-100 ">
          <div className='col-md-4 mb-2'>
            <TextField 
              id="outlined-basic-1" 
              label="City" 
              variant="outlined" 
              fullWidth 
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
            />
          </div>
          <div className='col-md-4 mb-2'>
            {/* <TextField id="outlined-basic-2" label="State/Provide" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, state: e.target.value })}/> */}
            {renderDropdown('state')}
          </div>
          <div className='col-md-4 mb-2'>
            <TextField 
              id="outlined-basic-3" 
              label="Zip/Postal Code"
               variant="outlined" 
               fullWidth 
               value={formData.postalcode}
               onChange={(e) => setFormData({ ...formData, postalcode: e.target.value })} 
              />
          </div>
        </div>


        <div className="d-flex gap-3 justify-content-end mt-4">
          <Button label="Cancel" onClick={() => { navigate(-1) }} severity="secondary" style={{ color: '#000', backgroundColor: '#fff', border: '2px solid #0f3995' }} />
          <Button label="Save" style={{ backgroundColor: '#0f3995' }} onClick={handleSaveClick} />
        </div>
      </div>
    </div>
  )
}

export default StaffUpdation;