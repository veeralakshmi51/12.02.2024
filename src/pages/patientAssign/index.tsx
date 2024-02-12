import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import { getAllBed,deletePatientAssignDetails } from "../../slices/patientAssign/thunk";
import ReactPaginate from "react-paginate";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Col,
  Row,
  CardFooter,
  Badge,
  CardHeader
} from "reactstrap";
import { toast } from "react-toastify";

const PatientAssign: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { patientAssignData = [], loading } = useSelector(
    (state: any) => state.PatientAssign
  );
  const { organization } = useSelector((state: any) => state.Login);
  const { patientData } = useSelector((state: any) => state.Patient);
  const { bedAssignData = []} = useSelector(
    (state: any) => state.BedAssign
  ); 
  console.log('bedassigndata',bedAssignData)
  console.log("Redux Patient Data:", patientData);
  console.log("patient assigned data:",patientAssignData)

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0); 
  const totalPages = Math.ceil(totalItems / perPage);
  const navigate = useNavigate();
  const selectedPatientId = patientData?.id;
 console.log(selectedPatientId);
 useEffect(() => {
    getAllBed(dispatch, organization);
  }, [dispatch, organization]);
  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are You Sure Do You Want To Delete?");
    if (confirmDelete) {
      try {
        await dispatch(deletePatientAssignDetails(id, organization));
        toast.success("Bed Assigned Deleted Successfully");
      } catch {
        toast.error("Failed to Delete the Details");
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
  
  
  return (
    <div className="container m15 p3" style={{ width: '90%' }}>
      
      
        <h2 className="m-0 " >All Bed Assigned List</h2>
        <hr></hr>
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
      {loading ? (
        <Loader />
      ) : (
        <Row className="mt-10 mb-4 m-0">
          {Array.isArray(patientAssignData) && patientAssignData.length > 0 ? (
            patientAssignData.map((patientassign: any, index: number) => (
              <Col key={patientassign.id}>
                <div className="bed-assignment-box">
                  <Card className="mb-3" color="danger" outline style={{width:'220px',height:'220px'}}>
                  <CardHeader tag="h6">Patient Name: {getPatientName(patientassign.pid)}</CardHeader>
                  <CardBody>
                      {/* <CardTitle tag="h6">Patient ID: {patientassign.pid}</CardTitle> */}
                      <CardSubtitle tag="h6" className="mb-2 text-muted">
                        <div>
                        Room No: {patientassign.roomNo}
                        </div>
                        Bed No: {patientassign.bedNo}
                      </CardSubtitle>
                    </CardBody>
                    
                      <CardFooter>
                        <Badge
                          color={patientassign.pid ? "danger" : "success"}
                          tag="h4"
                        >
                          {patientassign.pid ? "Not Available" : "Available"}
                        </Badge>
                        <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger" 
                    onClick={() => handleDelete(patientassign.id)}
                    style={{ cursor: "pointer",marginLeft:'40px' }}
                  />
                </CardFooter>
                      </Card>
                </div>
              </Col>
            ))
          ) : (
            <p>No bed assignments available.</p>
          )}
        </Row>
        
      )}
     
    </div>
  );
};

export default PatientAssign
