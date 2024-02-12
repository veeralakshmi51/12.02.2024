import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllPatient,
  updatePatientDetails,
  patientDischarge,
} from "../../slices/thunk";
import { FaPlus, FaPlusSquare, FaSearch,  } from "react-icons/fa";
import Tooltip from '@mui/material/Tooltip';
import { GoPersonAdd }from "react-icons/go";
import { Pagination } from "react-bootstrap";
import 
{
  Table,Button,Modal,ModalFooter
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
import "./patient.css";
import PatientCreation from "./patientCreation";
import { TextField,FormControl,OutlinedInput,InputLabel,MenuItem,Select} from "@mui/material";
import { baseURL } from "../../configuration/url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faPencil } from "@fortawesome/free-solid-svg-icons";
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
  beaconDevice: string;
  gender: string;
  country: string;

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
const Patient: React.FC = () => {
  const [modal,setModal]=useState(false);
  const toggle=()=>{
    setModal(!modal);
  }
  const [search,setSearch]=useState("");
  const [dropdownData, setDropdownData] = useState<Dropdown[]>([]);
  const dispatch = useDispatch<any>();
  const [selectPatientId, setSelectPatientId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const { patientData, loading } = useSelector((state: any) => state.Patient);
  const { organization } = useSelector((state: any) => state.Login);
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<FormData>({
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
    mrNumber: "",
    email: "",
    beaconDevice: "",
    gender: "",
    country: "",
  });

  useEffect(() => {
    getAllPatient(dispatch, organization);
  }, [dispatch, organization]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [filteredRecords,setFilteredRecords]=useState<any[]>([]);
  const currentPatientData =filteredRecords.slice(indexOfFirstItem,indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const renderPageNumbers = () => {
    const totalPages = Math.ceil(patientData.length / itemsPerPage);

    const pageNumbersToShow = Math.min(5, totalPages);

    let startPage: number;
    let endPage: number;

    if (totalPages <= pageNumbersToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const middlePage = Math.ceil(pageNumbersToShow / 2);

      if (currentPage <= middlePage) {
        startPage = 1;
        endPage = pageNumbersToShow;
      } else if (currentPage + middlePage >= totalPages) {
        startPage = totalPages - pageNumbersToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - middlePage + 1;
        endPage = currentPage + middlePage - 1;
      }
    }

    return Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
      <Pagination.Item
        key={startPage + index}
        active={startPage + index === currentPage}
        onClick={() => paginate(startPage + index)}
      >
        {startPage + index}
      </Pagination.Item>
    ));
  };
useEffect(()=>{
  setCurrentPage(1);
},[patientData]);

useEffect(() => {
  if (Array.isArray(patientData)) {
    const filteredPatientData = patientData.filter((patient: any) =>
      patient.basicDetails[0].name[0].given.toLowerCase().includes(search.toLowerCase()) ||
      patient.basicDetails[0].birthDate.toString().toLowerCase().includes(search.toLowerCase()) ||
      patient.basicDetails[0].ssn.toString().toLowerCase().includes(search.toLowerCase()) ||
      patient.beaconDevice.toLowerCase().includes(search.toLowerCase()) ||
      patient.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredRecords(filteredPatientData);
  }
}, [search, patientData]); 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDischarge = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are You Sure Do You Want to Discharge?"
    );
    if (confirmDelete) {
      try {
        await patientDischarge(dispatch, id, organization);
        console.log("Patient Discharged Successfully"); 
        getAllPatient(dispatch, organization);
      } catch {
        console.log("Failed to Delete Patient Details");
      }
    }
  };

  
  const handleSaveChanges = () => {
    console.log("Form Data:", formData);
    if (!selectPatientId) {
      console.error("Selected Patient ID is not found");
      return;
    }
    const updatedPatientFields = {
      id: selectPatientId,
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
      beaconDevice: formData.beaconDevice,
    };
    console.log("Before Update:", patientData);
    dispatch(
      updatePatientDetails(
        selectPatientId,
        updatedPatientFields,
        //setEditModal,
        organization
      )
    );

    console.log("After Update:", updatedPatientFields);
    setEditModal(false);
  };



  const handleClick = (selectedPatient: any) => {
    console.log("Clicked patient Details:", selectedPatient);

    if (selectedPatient) {
      const patientId = selectedPatient.id || "";
      setSelectPatientId(patientId);
      console.log("Patiend ID:", patientId);
      const basicDetails = selectedPatient.basicDetails[0];
      const address = selectedPatient.contact[0]?.address[0];

      setFormData({
        firstName: basicDetails.name[0]?.given || "",
        middleName: basicDetails.name[0]?.use || "",
        lastName: basicDetails.name[0]?.family || "",
        birthDate: basicDetails.birthDate || "",
        ssn: basicDetails.ssn || "",
        addressLine1: address?.addressLine1 || "",
        addressLine2: address?.addressLine2 || "",
        city: address?.city || "",
        state: address?.state || "",
        postalCode: address?.postalCode || "",
        mrNumber: basicDetails.mrNumber || "",
        email: selectedPatient.email || "",
        beaconDevice: selectedPatient.beaconDevice || "",
        gender: basicDetails.gender || "",
        country: address?.country || "",
      });

      setEditModal(true);
    } else {
      console.error("Invalid patient data:", selectedPatient);
    }
  };
  
  const handleSelectChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value });
  };
  
  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({
    city: false,
    Country: false,
    state: false,
  });
  const [selectedValues, setSelectedValues] = useState<any>({
    city: [],
    Country: [],
    state: [],
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
          value={formData[dropdownName as keyof FormData]}
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
  

  return (
    <div className="container m5 p3" style={{ width: '90%' }}>
      {/* {loading && <Loader />} */}
      <div className="row" style={{ position: "relative" }}>
  <div className="col-md-8 d-flex align-items-center">
  {/* <h4 className="me-auto">Patient List</h4> */}
</div>
<div className="col-md-4 d-flex justify-content-end align-items-center gap-2 mb-2">
        {/* <p onClick={toggle} style={{cursor:'pointer'}} className="mb-0">Create</p> */}
        <div className="mx-0 search-container d-flex align-items-center">
    <input
      type="text"
      placeholder="Search..."
      className="search form-control"
      onChange={(e) => setSearch(e.target.value)}
    />
    <FaSearch className="search-icon" />
  </div>
            <FaPlusSquare
                data-bs-target="#exampleModal"
                style={{ cursor: "pointer", fontSize: '30px', color:'#1F489F' }}
                // onClick={() => navigate("/patient-register")}
                onClick={toggle}
              />
        </div>
      <hr></hr>
      <div className="row">
      <div className="col-md-3">
  
</div>
      </div>
      <table className="table table-bordered" style={{fontSize: '13px'}}>
        <thead style={{ backgroundColor: "#F8FAFB" }}>
          <tr>
          <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>S.No</th>
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Patient Name</th>
            {/* <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Patient ID</th> */}
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>SSN</th>
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Beacon Device</th>
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Room No - Bed No</th>
            <th scope="col" className="text-center" style={{ color: "rgba(0, 0, 0, 0.5)" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPatientData
            .map((patient: any, index: number) => (
              <tr key={index}>
                <td className="text-center">{ indexOfFirstItem+index + 1}</td>
                <td
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleClick(patient)
                }
                  className="text"
                >
                  {patient.basicDetails[0].name[0].given}{" "}
                  {patient.basicDetails[0].name[0].family}
                </td>
                {/* <td className="text">{patient.id}</td> */}
                <td className="text-center">{patient.basicDetails[0].ssn}</td>
                <td className="text-center">{patient.beaconDevice}</td>
                <td className="text-center">{patient.assignedBed}</td>
                <td className="text-center d-flex justify-content-around align-items-center">
                <Tooltip title="Edit" arrow>
                  <FontAwesomeIcon
                      icon={faPencil}
                      title="Edit"
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleClick(patient)
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Discharge" arrow>
                    <FontAwesomeIcon
                      icon={faBan}
                      className="text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDischarge(patient.id)}
                    />
                  </Tooltip>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
    <PatientCreation modal={modal} toggle={toggle}/>
    <div className="pagination-container" >
  <div className="d-flex justify-content-center">
    <Pagination>
      <Pagination.Prev
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {renderPageNumbers()}
      <Pagination.Next
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === Math.ceil(patientData.length / itemsPerPage)}
      />
    </Pagination>
  </div>
</div>
    <Modal
        isOpen={editModal}
        toggle={() => setEditModal(false)}
        centered
        size="lg"
      ><div className="d-flex align-items-center justify-content-center vh-90">
      <div className="row">
      <div className="container col-md-12">
      <div className="d-flex justify-content-center align-items-center">
                <h3 className="mt-1">Patient Details</h3>
              </div>
              <hr></hr>
    
            <div className="row w-100 ">
              <div className="col-md-4 mb-2">
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  placeholder="Enter First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </div>
              <div className="col-md-4 mb-2">
                <TextField
                  id="middleName"
                  name="middleName"
                  label="Middle Name"
                  placeholder="Enter Middle Name"
                  value={formData.middleName}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </div>
              <div className="col-md-4 mb-2">
                <TextField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter LastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </div>
            </div>
            <div className="row w-100">
            <div className="col-md-4 mt-3">
                {/* <TextField
                  id="gender"
                  name="gender"
                  label="Gender"
                  placeholder="Enter Gender"
                  value={formData.gender}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                /> */}
                {renderDropdown('gender')}
              </div>
              <div className="col-md-4 mb-2">
                <TextField
                  id="birthDate"
                  name="birthDate"
                  label="Date Of Birth"
                  placeholder="Enter DateOfBirth"
                  value={formData.birthDate}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </div>
              <div className="col-md-4 mb-2">
                <TextField
                  id="mrNumber"
                  name="mrNumber"
                  label="MrNumber"
                  placeholder="Enter Phone Number"
                  value={formData.mrNumber}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            </div>
            <div className="row w-100">
            <div className="col-md-6 mb-2">
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            <div className="col-md-6 mb-2">
                <TextField
                  id="ssn"
                  name="ssn"
                  label="SSN"
                  placeholder="Enter SSN"
                  value={formData.ssn}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            </div>
          
            <div className="row w-100">
            <div className="col-md-4 mb-2">
                <TextField
                  id="addressLine1"
                  name="addressLine1"
                  label="AddressLine1"
                  placeholder="Enter Address"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            <div className="col-md-4 mb-2">
                <TextField
                  id="addressLine2"
                  name="addressLine2"
                  label="AddressLine2"
                  placeholder="Enter Address"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            <div className="col-md-4 mb-2">
                <TextField
                  id="country"
                  name="country"
                  label="Country"
                  placeholder="Enter Country"
                  value={formData.country}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            </div>
            <div className="row w-100">
            <div className="col-md-4 mb-2">
                <TextField
                  id="city"
                  name="city"
                  label="City"
                  placeholder="Enter City"
                  value={formData.city}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            <div className="col-md-4 mt-3">
                {/* <TextField
                  id="state"
                  name="state"
                  label="State"
                  placeholder="Enter State"
                  value={formData.state}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                /> */}
                {renderDropdown('state')}
            </div>
            <div className="col-md-4 mb-2">
                <TextField
                  id="zip"
                  name="zip"
                  label="Zip/Postal Code"
                  placeholder="Enter Zip"
                  value={formData.postalCode}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
            </div>
            </div>
      </div>
    </div>
</div>
<ModalFooter>
  <Button onClick={()=>setEditModal(false)} className="btn-danger">Cancel</Button>
  <Button onClick={handleSaveChanges} className="btn-info">Save Changes</Button>
</ModalFooter>
</Modal>

    </div>
  );
};

export default Patient;
