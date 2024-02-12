import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faDoorOpen, faTrash } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import {
  getAllBedAssign,
  deleteBedAssignDetails
} from "../../slices/bedAssign/thunk";
import { getAllBed,deletePatientAssignDetails } from "../../slices/patientAssign/thunk";
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
  Button
} from "reactstrap";
import ReactPaginate from "react-paginate";
import "./bedassign.css";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import roomImage from './../../assets/images/roomImage.svg';
import bedImage from './../../assets/images/bedImage.jpg';
import patientImage from './../../assets/images/patientImage.png'
import 
{
  Table,
} from "reactstrap";
import { Pagination } from "react-bootstrap";
 
interface FormData {
  id: string;
  bedId: string;
  pid: string;
  orgId: string;
}
interface Bed {
  roomNoStart: string;
  roomNoEnd: string;
  bedNo: string;
  oddOrEven: string,
  organization:string,
}
const BedAssign: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [bedId, setBedId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [showModal,setShowModal]=useState(false);
  const [search, setSearch] = useState("");
  const [patientAndBedAssign, setPatientAndBedAssign] = useState<any[]>([]);
  const [value, setValue] = React.useState('1');
  let [increment, setIncrement] = useState(1);

  function getIncrement(){
    return increment++;
  }
 
  const handleChange = (event:any, newValue:any) => {
    setValue(newValue);
    getAllBedAssign(dispatch, organization);
    getAllBed(dispatch,organization);
  };
 
  const { bedAssignData = [], loading } = useSelector(
    (state: any) => state.BedAssign
  );
  const { organization } = useSelector((state: any) => state.Login);
  const { patientData } = useSelector((state: any) => state.Patient);
  const navigate = useNavigate();
  const selectedPatientId = patientData?.id;
 
  const [bedAssignedData, setBedAssignedData] = useState<FormData>({
    id: "",
    bedId: bedAssignData.bedId,
    pid: selectedPatientId || "",
    orgId: organization,
  });
 
  let [newAssignedBy, setAssignedBy] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const handlePatientChange = (selectedPatientId: string) => {
    setBedAssignedData((prevData) => ({ ...prevData, pid: selectedPatientId }));
  };
 
  useEffect(() => {
    getAllBedAssign(dispatch, organization);
    fetchPatients();
    fetchPatientsandBedAssign();
    setAssignedBy(window.localStorage.getItem("LoginData"));
  }, [dispatch, organization, bedAssignedData]);
  console.log((newAssignedBy));
 
  const [formData, setFormData] = useState<Bed>({
    roomNoStart: "",
    roomNoEnd: "",
    bedNo: "",
    oddOrEven: "",
    organization:organization,
  });
  const handleSave = async () => {
    const requestBody = {
      bedId: bedId,
      pid: bedAssignedData.pid,
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
        setEditModal(false);  
        getAllBedAssign(dispatch, organization);
        getAllBed(dispatch,organization)
      } else {
        console.error("Error:", response.data.message);
        alert(`Error: ${response.data.message.description}`);
      }
    } catch (error) {
      console.error("API Request Error:", error);
      alert("An error occurred. Please check console for details.");
    } finally {
      setEditModal(false);
    }
  };
 
  const handleClick = (selectedBed: any) => {
    if (selectedBed) {
   
      const bedAssignId = selectedBed.id || " ";
      setBedId(bedAssignId);
      console.log("Bed Id:", bedAssignId);
      console.log("Clicked details", selectedBed);
      setBedAssignedData({
        id: selectedBed.id,
        bedId: selectedBed.bedId,
        pid: selectedBed.pid,
        orgId: selectedBed.orgId,
      });
      console.log("Responses:", selectedBed);
      setEditModal(true);
    } else {
      console.error("Invalid Data:", selectedBed);
    }
  };
 
  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        `http://47.32.254.89:7000/api/patient/get/activePatient/${organization}`
      );
      console.log("Patient API Response:", response.data);
      if (response.data.data && Array.isArray(response.data.data)) {
        setPatients(response.data.data);
      } else {
        console.error("Invalid data format for patients:", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
 
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
 
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are You Sure Do You Want To Delete bed?");
    if (confirmDelete) {
      try {
 
        await dispatch(deleteBedAssignDetails(id, organization));
        alert("Bed Assigned Discharge Successfully");
      } catch {
        alert("Failed to Discharge the Details");
      }
    }
  };
  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };
 
const handlePatientClick=(e:React.FormEvent)=>{
  e.preventDefault();
 // setShowModal(!showModal)
  window.location.href = "/add-bed-table";
}
 
const { patientAssignData = [] } = useSelector(
  (state: any) => state.PatientAssign
);
 
console.log('patientAndBedAssign',patientAndBedAssign)
console.log("Redux Patient Data:", patientData);
console.log("patient assigned data:",patientAssignData)
 
const [currentPage, setCurrentPage] = useState(0);
const [perPage] = useState(10);
const [totalItems, setTotalItems] = useState(0);
const totalPages = Math.ceil(totalItems / perPage);
useEffect(() => {
  getAllBed(dispatch, organization);
}, [dispatch, organization]);
 
 
const handlePatientDelete = async (id: string) => {
  const confirmDelete = window.confirm("Are You Sure Do You Want To Discharge?");
  if (confirmDelete) {
    try {
      await dispatch(deletePatientAssignDetails(id, organization));
      alert("Bed Assigned Deleted Successfully");
    } catch {
      alert("Failed to Delete the Details");
    }
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
 
  const handleSaveBed = async () => {
    if (!formData.bedNo) {
    alert("Please fill All The Fields");
    return;
  }
 
  console.log("Organization:", organization);
    const requestBody = {    
      roomNoStart: formData.roomNoStart,
      roomNoEnd: formData.roomNoEnd,
      bedNo:formData.bedNo,
      oddOrEven:formData.oddOrEven,
      organization:formData.organization
    };    
    try {
      const response = await axios.post(
        "http://47.32.254.89:7000/api/Q15Bed/create",
        requestBody
      );
      console.log("Registered Data:", response.data);
      console.log("Request details:", requestBody);
      console.log('ID:',response.data.data.id)
      if (
        response.data.message &&
        response.data.message.code === "MHC - 0200"
      )
      {
        alert(response.data.message.description);
        setEditModal(false);
        getAllBedAssign(dispatch, organization);
        getAllBed(dispatch, organization);
      } else {
        console.log("error:", response.data.message);
        alert(`Error:${response.data.message.description}`);
      }
    } catch (error) {
      alert("Room No and Bed No Already Exists");
     
    }
    setEditModal(false);
  };
  const itemsPerPage = 8;
  const [bedCurrentPage, setBedCurrentPage] = useState(1);
  const indexOfLastItem = bedCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBedAssignData =
  bedAssignData && bedAssignData?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setBedCurrentPage(pageNumber);
  const renderPageNumbers = () => {
    const totalPages = Math.ceil(bedAssignData.length / itemsPerPage);

    const pageNumbersToShow = Math.min(5, totalPages);

    let startPage: number;
    let endPage: number;

    if (totalPages <= pageNumbersToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const middlePage = Math.ceil(pageNumbersToShow / 2);

      if (bedCurrentPage <= middlePage) {
        startPage = 1;
        endPage = pageNumbersToShow;
      } else if (bedCurrentPage + middlePage >= totalPages) {
        startPage = totalPages - pageNumbersToShow + 1;
        endPage = totalPages;
      } else {
        startPage = bedCurrentPage - middlePage + 1;
        endPage = bedCurrentPage + middlePage - 1;
      }
    }
    return Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
      <Pagination.Item
        key={startPage + index}
        active={startPage + index === bedCurrentPage}
        onClick={() => paginate(startPage + index)}
      >
        {startPage + index}
      </Pagination.Item>
    ));
  }
  
  return (
    <div className="container m15 p3" style={{ width: "90%" }}>
      <div className="row mb-2" style={{marginBottom:'0.1rem !important'}}>
        <div className="col-md-8">
          <div className="heading1">
            <h4>All Bed Details</h4>
            <br />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mx-2">
          </div>
        </div>
      </div>
      <hr style={{margin:'0.2rem'}}></hr>  
      <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="All Beds" value="1" />
            <Tab label="Occupied" value="2" />
            <Tab label="Available" value="3" />
          </TabList>
        </Box>        
        <TabPanel sx={{padding:'0px'}} value="1">        
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
                        width: "92px",
                        height: "70px",
                        margin: "5px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <CardBody
                        key={index}
                        className=" d-flex gap-1"                      
                        style={{ cursor: "pointer", padding:'0.6rem' }}
                      >
                        <CardTitle tag="h6">
                        <FontAwesomeIcon icon={faDoorOpen} style={{ width: '15px', height: '20px' }} />
                        <span style={{ marginLeft:'3px',fontSize: '12px', fontWeight: 'bold' }}>{bedassign.roomNo}</span>
                        {/* <img src={roomImage} style={{width:'15px',height:'20px'}}></img> <span style={{fontSize:'12px',fontWeight:'bold'}}>{bedassign.roomNo}</span> */}
                        </CardTitle>
                        <CardSubtitle tag="h6" className=" text-muted">
                        <FontAwesomeIcon icon={faBed} style={{ width: '12px', height: '20px' }} />
                        <span style={{ marginLeft:'3px', fontSize: '12px', fontWeight: 'bold' }}>{bedassign.bedNo}</span>
                        {/* <img src={bedImage} style={{width:'30px',height:'35px'}}></img> <span style={{fontSize:'10px',fontWeight:'bold'}}>{bedassign.bedNo}</span> */}
                        </CardSubtitle>
                      </CardBody>
 
                      <CardFooter style={{padding:'0.2rem', position:'relative', display:'flex', top:'-13px', height:'25px',fontSize:'10px', fontWeight:'bold',lineHeight:'normal'}}>
                      <img src={patientImage} style={{width:'20px',height:'20px'}}></img><span style={{paddingLeft:'5px'}}>{getPatientName(bedassign.pid)}</span>                       
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
                        width: "92px",
                        height: "70px",
                        margin: "5px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <CardBody
                        key={index}
                        className="d-flex gap-1"
                        onClick={() => handleClick(bedassign)}
                        style={{ cursor: "pointer", padding:'0.6rem' }}
                      >
                        <CardTitle tag="h6">
                        <FontAwesomeIcon icon={faDoorOpen} style={{ width: '15px', height: '20px' }} />
                        <span style={{  marginLeft:'3px',fontSize: '12px', fontWeight: 'bold' }}>{bedassign.roomNo}</span>
                        {/* <img src={roomImage} style={{width:'15px',height:'20px'}}></img> <span style={{fontSize:'12px',fontWeight:'bold'}}>{bedassign.roomNo}</span> */}
                        </CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted ">
                        <FontAwesomeIcon icon={faBed} style={{ width: '12px', height: '20px' }} />
                        <span style={{  marginLeft:'3px',fontSize: '12px', fontWeight: 'bold' }}>{bedassign.bedNo}</span>
                        {/* <img src={bedImage} style={{width:'30px',height:'35px'}}></img> <span style={{fontSize:'10px',fontWeight:'bold'}}>{bedassign.bedNo}</span> */}
                        </CardSubtitle>
                      </CardBody>
 
                      <CardFooter style={{padding:'0.6rem', position:'relative', top:'-13px', height:'25px',paddingTop:'5px',paddingLeft:'13px'}}>
                        <Badge
                        style={{fontSize:'10px'}}
                          color={bedassign.pid ? "danger" : "success"}
                          tag="h6"
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
          </Row>
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>   
        </TabPanel>
        <TabPanel value="2">  
        <Row style={{ display: "flex", flexWrap: "wrap", justifyContent:'space-evenly' }}>
            {Array.isArray(patientAssignData) && patientAssignData.length > 0 ? (
            patientAssignData.map((patientassign: any, index: number) => (
                <Col key={index} style={{flex: 0, padding:0 }}>
                  <div className="bed-assignment-box">
                    <Card
                      className="mb-3"
                      color="danger"
                      outline
                      style={{
                        width: "92px",
                        height: "70px",
                        margin: "5px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <CardBody
                        key={index}
                        className="d-flex gap-1"                      
                        style={{ cursor: "pointer", padding:'0.6rem' }}
                      >
                        <CardTitle tag="h6">
                        <FontAwesomeIcon icon={faDoorOpen} style={{ width: '15px', height: '20px' }} />
                        <span style={{  marginLeft:'3px',fontSize: '12px', fontWeight: 'bold' }}>{patientassign.roomNo}</span>
                        {/* <img src={roomImage} style={{width:'15px',height:'20px'}}></img> <span style={{fontSize:'10px',fontWeight:'bold'}}>{patientassign.roomNo}</span> */}
                        </CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted ">
                        <FontAwesomeIcon icon={faBed} style={{ width: '12px', height: '20px' }} />
                        <span style={{ marginLeft:'3px', fontSize: '12px', fontWeight: 'bold' }}>{patientassign.bedNo}</span>
                        {/* <img src={bedImage} style={{width:'30px',height:'35px'}}></img> <span style={{fontSize:'10px',fontWeight:'bold'}}>{patientassign.bedNo}</span> */}
                        </CardSubtitle>
                      </CardBody>
 
                      <CardFooter style={{padding:'0.2rem', position:'relative', display:'flex', top:'-13px', height:'25px',fontSize:'10px', fontWeight:'bold',lineHeight:'normal'}}>
                      <img src={patientImage} style={{width:'20px',height:'20px'}}></img><span style={{paddingLeft:'5px'}}>{getPatientName(patientassign.pid)}</span>
                      </CardFooter>
                    </Card>
                  </div>
                </Col>
              ))
            ) : (
              <p>No bed assignments available.</p>
            )}
          </Row>                      
        </TabPanel>
        <TabPanel value="3">   
        <div>
          <Row style={{ display: "flex", flexWrap: "wrap", justifyContent:'space-evenly' }}>
            {Array.isArray(bedAssignData) && bedAssignData.length > 0 ? (
              bedAssignData.map((bedassign: any, index: number) => (
                <Col key={index} style={{flex: 0, padding:0 }}>
                  <div className="bed-assignment-box">
                    <Card
                      className="mb-3"
                      color="primary"
                      outline
                      style={{
                        width: "92px",
                        height: "70px",
                        margin: "5px",
                        justifyContent: "flex-start",
                      }}
                    >
                      <CardBody
                        key={index}
                        className="d-flex gap-1"
                        onClick={() => handleClick(bedassign)}
                        style={{ cursor: "pointer", padding:'0.6rem' }}
                      >
                        <CardTitle tag="h6">
                        <FontAwesomeIcon icon={faDoorOpen} style={{ width: '15px', height: '20px' }} />
                        <span style={{ marginLeft:'3px', fontSize: '12px', fontWeight: 'bold' }}>{bedassign.roomNo}</span>
                        {/* <img src={roomImage} style={{width:'15px',height:'20px'}}></img> <span style={{fontSize:'10px',fontWeight:'bold'}}>{bedassign.roomNo}</span> */}
                        </CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted ">
                        <FontAwesomeIcon icon={faBed} style={{ width: '12px', height: '20px' }} />
                        <span style={{  marginLeft:'3px',fontSize: '12px', fontWeight: 'bold' }}>{bedassign.bedNo}</span>
                        {/* <img src={bedImage} style={{width:'30px',height:'35px'}}></img> <span style={{fontSize:'10px',fontWeight:'bold'}}>{bedassign.bedNo}</span> */}
                        </CardSubtitle>
                      </CardBody>
 
                      <CardFooter style={{padding:'0.6rem', position:'relative', top:'-13px', height:'35px',paddingTop:'5px',paddingLeft:'13px'}}>
                        <Badge
                        style={{fontSize:'10px'}}
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
                </Col>
              ))
            ) : (
              <p>No bed assignments available.</p>
            )}
          </Row>
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>                  
        </TabPanel>
      </TabContext>
    </Box>
     
      <Modal isOpen={editModal} style={{width:'100%'}} sx={{innerWidth:'100%',outerWidth:'100%'}} toggle={() => setEditModal(false)}>
        <ModalHeader toggle={() => setEditModal(false)}>Assign Bed For Patient</ModalHeader>
        <ModalBody>
          <div>          
            <div className="form-control">
              <label
                htmlFor="patientName"
                className="floating-label"
                style={{ fontWeight: "bold" }}
              >
                Patient Name
              </label>
              <Input
                type="select"
                id="patientName"
                name="pid"
                value={bedAssignedData.pid}
                onChange={(e) => handlePatientChange(e.target.value)}
              >
                <option value="">Select Patient</option>
                {patients
                  .filter((patient: any) =>
                    patient.basicDetails[0].name[0].given
                      .toLowerCase()
                      .includes(search.toLowerCase())
                    || patientData.basicDetails[0].name[0].family.toLowerCase().includes(search.toLowerCase()))
                  .map((patient:any) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.basicDetails[0].name[0].given}{" "}
                      {patient.basicDetails[0].name[0].family}
                    </option>
                  ))}
              </Input>            
            </div>           
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setEditModal(false)}
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal> 
       <Modal isOpen={showModal} toggle={() => setShowModal(false)} centered>
        <ModalHeader toggle={() => setShowModal(false)}>
          <h3>Bed Assign Details</h3>
        </ModalHeader>
        <ModalBody>
          <div>
            <div className="form-control">
              <label
                htmlFor="roomNo"
                className="floating-label"
                style={{ fontWeight: "bold",width:'30%' }}
              >
                Start Room No:
              </label>
              <input style={{width:'20%'}}
                type="text"
                id="roomNo"
                name="roomNo"
                placeholder="Enter No"
                value={formData.roomNoStart}
                onChange={(e) => setFormData({ ...formData, roomNoStart: e.target.value })}
              ></input>
              <label style={{width:'2%'}}/>
              <label
                htmlFor="bedNo"
                className="floating-label"
                style={{ fontWeight: "bold",width:'28%' }}
              >
                End Room No:
              </label>
              <input style={{width:'20%'}}
                type="text"
                id="bedNo"
                name="bedNo"
                placeholder="Enter No"
                value={formData.roomNoEnd}
                onChange={(e) => setFormData({ ...formData, roomNoEnd: e.target.value })}
              ></input>
              <div style={{marginBottom:'15px'}}></div>
              <label
                htmlFor="roomNo"
                className="floating-label"
                style={{ fontWeight: "bold",width:'30%' }}
              >
                Bed No:
              </label>
              <input style={{width:'20%'}}
                type="text"
                id="roomNo"
                name="roomNo"
                placeholder="Enter No"
                value={formData.bedNo}
                onChange={(e) => setFormData({ ...formData, bedNo: e.target.value })}
              ></input>
              <label style={{width:'2%'}}/>
              <label
                htmlFor="bedNo"
                className="floating-label"
                style={{ fontWeight: "bold",width:'28%' }}
              >
                Type:
              </label>
              <select id="bedNo"  style={{width:'20%', height:'45px', border:'1px solid black', borderRadius:'5px' }} name="bedNo" value={formData.oddOrEven} onChange={(e) => setFormData({ ...formData, oddOrEven: e.target.value })} >
                                            <option value="" >Select</option>
                                            <option value="odd" >Odd</option>
                                            <option value="even" >Even</option>
                                        </select>    
                                        
          <Pagination>
            <Pagination.Prev
              onClick={() => setBedCurrentPage(bedCurrentPage - 1)}
              disabled={bedCurrentPage === 1}
            />
            {renderPageNumbers()}
            <Pagination.Next
              onClick={() => setBedCurrentPage(bedCurrentPage + 1)}
              disabled={bedCurrentPage === Math.ceil(bedAssignData.length / itemsPerPage)}
            />
          </Pagination>        
              <Table responsive bordered>
        <thead>
          <tr>
          <th scope="col" className="text-center">S.No</th>
            <th scope="col" className="text-center">Room No</th>
            <th scope="col" className="text-center">Bed No</th>
          </tr>
          </thead>
          <tbody>
          {Array.isArray(currentBedAssignData) && currentBedAssignData.length > 0 && (
              currentBedAssignData.map((bedassign: any, index: number) => (
            <tr key={parseInt(bedassign.roomNo)}>
              <td>{increment++}</td>
              <td>{bedassign.roomNo}</td>
              <td>{bedassign.bedNo}</td>
            </tr>    
              )))}       
          </tbody>
          </Table>               
              <ModalFooter style={{position:'relative', top:'12px'}}>
            <Button color="info" onClick={handleSaveBed}>
              Save Changes            
            </Button>{" "}
            <Button color="danger" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
 
export default BedAssign;