import React, { useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField,OutlinedInput} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateOrganizationDetails } from "../../slices/thunk";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import { formatPhoneNumber } from "../../helpers/common";
interface FormData {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  websiteUrl: string;
  OrganizationType: string;
  hippaPrivacyOfficerName: string;
  proximityVerification: string;
  geofencing: string;
  q15Access: string;
  duration: string;
  startTime: string;
  addressLine1: string; 
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  cPerson: string;
  cEmail: string;
  cPhone: string;
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
const OrganizationUpdate = () => {
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { organizationDetails } = useSelector(
    (state: any) => state.Organization
  );
  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    email: "",
    mobileNumber: "",
    websiteUrl: "",
    OrganizationType: "",
    hippaPrivacyOfficerName: "",
    proximityVerification: "",
    geofencing: "",
    q15Access: "",
    duration: "",
    startTime: "",
    addressLine1: "", 
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    cPerson: "",
    cEmail: "",
    cPhone: "",
  });
  const [prevFormData, setPrevFormData] = useState<FormData | null>(null);
  const [selectedValues,setSelectedValues]=useState<any>({
    type:formData.OrganizationType,
    state:formData.state,
    country:formData.country,
  })
  useEffect(() => {
    if (location.state) {
      setFormData({
        id: location.state?.id || "",
        name: location.state?.organizationdetails && location.state?.organizationdetails[0]?.name || "",
        email: location.state?.email || "",
        mobileNumber: location.state?.mobileNumber || "",
        websiteUrl: location.state?.websiteUrl || "",
        OrganizationType: location.state?.organizationdetails && location.state?.organizationdetails[0].type || "",
        hippaPrivacyOfficerName: location.state?.hippaprivacyofficer && location.state?.hippaprivacyofficer[0]?.name || "",
        startTime: location.state?.shift?.startTime || "",
        duration: location.state?.shift?.duration || "",
        proximityVerification: location.state?.proximityVerification || "",
        q15Access: location.state?.q15Access || "",
        geofencing: location.state?.geofencing || "",
        addressLine1: location.state?.contact && location.state.contact[0]?.addressLine1 || "",
        addressLine2: location.state?.contact && location.state.contact[0]?.addressLine2 || "",
        city: location.state?.contact && location.state.contact[0]?.city || "",
        state: location.state?.contact && location.state.contact[0]?.state || "",
        country: location.state?.contact && location.state.contact[0]?.country || "",
        zip: location.state?.contact && location.state.contact[0]?.zip || "",
        cPerson: location.state?.pointofcontact && location.state.pointofcontact[0]?.name || "",
        cEmail: location.state?.pointofcontact && location.state.pointofcontact[0]?.email || "",
        cPhone: location.state?.pointofcontact && location.state.pointofcontact[0]?.phoneNumber || "",
      });
      setSelectedValues((prevValues:any) => ({
        ...prevValues,
        type: location.state?.organizationdetails && location.state?.organizationdetails[0].type || "",
        state: location.state?.contact && location.state.contact[0]?.state || "",
        country: location.state?.contact && location.state.contact[0]?.country || "",
      }));
    }
  }, [location.state]);


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
  console.log(location.state);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    console.log("Selected organization ID:", !params?.id);
    console.log("Form data:", formData);
    console.log("Previous Form Data:", prevFormData);

    if (!params.id) {
      console.error("Selected organization ID not found");
      return;
    }

    const updatedFields = {
      id: params?.id,
      organizationdetails: [
        {
          name: formData.name,
          type: formData.OrganizationType,
        },
      ],
      email: formData.email,
      websiteUrl: formData.websiteUrl,
      shift: {
        duration: formData.duration,
        startTime: formData.startTime,
      },
      contact:[
        {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zip: formData.zip
        }
      ],
      pointofcontact:[
        {
          name: formData.cPerson,
          email: formData.cEmail,
          phoneNumber: formData.cPhone,
        }
      ],
      proximityVerification: formData.proximityVerification,
      geofencing: formData.geofencing,
      q15Access: formData.q15Access,
      hippaprivacyofficer: [
        {
          name: formData.hippaPrivacyOfficerName,
        },
      ],
      mobileNumber: formData.mobileNumber,
    };
    // console.log("BeforeUpdate:", organizationDetails);
    dispatch(updateOrganizationDetails(params?.id, updatedFields));
    // console.log("After Upadate", updatedFields);
    //toast.error("Organization Details Updated Successfully");
    navigate("/organization-details");
  };

const [openState,setOpenState]=useState<{[key:string]:boolean}>({
  OrganizationType:false,
  state:false,
  country:false,
})
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
          <MenuItem key={item.id} value={item.value}>
            {item.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

  return (
    <div className="row w-100" >
      <div className="col-md-2"></div>
      <div className="col-md-8">
        <h3 className="mb-2 text-center">Organization Details Update Here</h3>
        <hr></hr>
        <div className="row w-100 " style={{ marginTop: "20px" }}>
          <div className="col-md-6 mb-4">
            <TextField
              id="outlined-basic-1" label="Organization Name" variant="outlined" fullWidth onChange={handleChange} value={formData.name} name="name"/>
          </div>
          <div className="col-md-6 mb-4">
            <TextField id="outlined-basic-2" label="Organization Email" variant="outlined" fullWidth onChange={handleChange} value={formData.email} name="email"/>
          </div>
          
        </div>
        <div className="row w-100 ">
        <div className="col-md-4 mb-4">
            {/* <TextField id="outlined-basic-1" label="Organization Type" variant="outlined" fullWidth onChange={handleChange} value={formData.type} name="type"/>  */}
            {renderDropdown('OrganizationType')}
          </div>
          <div className="col-md-4 mb-4">
            <TextField id="outlined-basic-1" label="Mobile Number" variant="outlined" fullWidth onChange={handleChange} value={formatPhoneNumber(formData.mobileNumber)} name="mobileNumber"/>
          </div>
          <div className="col-md-4 mb-4">
            <TextField id="outlined-basic-1" label="Website URL" variant="outlined" fullWidth onChange={handleChange} value={formData.websiteUrl} name="websiteUrl"/>
          </div>
        </div>

        <div className="row w-100 ">
        <div className="col-md-4 mb-4">
            <TextField id="outlined-basic-1" label="Contact person" variant="outlined" fullWidth onChange={handleChange} value={formData.cPerson} name="organizationType"/>
          </div>
          <div className="col-md-4 mb-4">
            <TextField id="outlined-basic-1" label="Contact Mobile " variant="outlined" fullWidth onChange={handleChange} value={formatPhoneNumber(formData.cPhone)} name="cPhone"/>
          </div>
          <div className="col-md-4 mb-4">
            <TextField id="outlined-basic-1" label="Contact email" variant="outlined" fullWidth onChange={handleChange} value={formData.cEmail} name="websiteUrl"/>
          </div>
        </div>

        <div className="row w-100">
  <div className="col-md-4 mb-4">
    <TextField
      id="outlined-addressLine1"
      label="Address Line 1"
      variant="outlined"
      fullWidth
      onChange={handleChange}
      value={formData.addressLine1}
      name="addressLine1"
    />
  </div>
  <div className="col-md-4 mb-4">
    <TextField
      id="outlined-addressLine2"
      label="Address Line 2"
      variant="outlined"
      fullWidth
      onChange={handleChange}
      value={formData.addressLine2}
      name="addressLine2"
    />
  </div>
  <div className="col-md-4 mb-4">
    {/* <TextField
      id="outlined-state"
      label="State"
      variant="outlined"
      fullWidth
      onChange={handleChange}
      value={formData.state}
      name="state"
    /> */}
    {renderDropdown('state')}
  </div>
</div>
<div className="row w-100">
  <div className="col-md-4 mb-4">
    <TextField
      id="outlined-city"
      label="City"
      variant="outlined"
      fullWidth
      onChange={handleChange}
      value={formData.city}
      name="city"
    />
  </div>
  <div className="col-md-4 mb-4">
    {/* <TextField
      id="outlined-country"
      label="Country"
      variant="outlined"
      fullWidth
      onChange={handleChange}
      value={formData.country}
      name="country"
    /> */}
    {renderDropdown('Country')}
  </div>
  <div className="col-md-4 mb-4">
    <TextField
      id="outlined-zip"
      label="ZIP"
      variant="outlined"
      fullWidth
      onChange={handleChange}
      value={formData.zip}
      name="zip"
    />
  </div>
</div>

        <div className="row w-100 ">
        <div className="mt-0">
                  <label htmlFor="organizationType" className="label">
                    Access Control
                  </label>
                </div>
          <div className="col-md-4 mt-2">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="proximity-label">Proximity</InputLabel>
                    <Select
                        labelId="proximity-label"
                        id="proximity"
                        label="Proximity"
                        onChange={handleChange}
                        value={formData.proximityVerification}
                        name="proximityVerification"
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                  </FormControl>
                </div>
                <div className="col-md-4 mt-2">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="q15-access-label">Q15</InputLabel>
                    <Select
                      labelId="q15-access-label"
                      id="q15Access"
                      label="Q15"
                      onChange={handleChange} 
                      value={formData.q15Access}
                      name="q15Access"
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="col-md-4 mt-2">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="geofencing-label">Geo Fencing</InputLabel>
                    <Select
                      labelId="geofencing-label"
                      id="geofencing"
                      label="Geo Fencing"
                      onChange={handleChange} 
                      value={formData.geofencing}
                      name="geofencing"
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                </div>
        </div>
        <div className="row w-100">
        </div>
        <div className="d-flex gap-3 justify-content-end mt-4">
          <Button
            label="Cancel"
            onClick={() => {
              navigate(-1);
            }}
            severity="secondary"
            style={{
              color: "#000",
              backgroundColor: "#fff",
              border: "2px solid #0f3995",
            }}
          />
          <Button
            label="Save"
            style={{ backgroundColor: "#0f3995" }}
            onClick={handleSaveChanges}
          />
        </div>
      </div>
    </div>
  );
};
export default OrganizationUpdate;
