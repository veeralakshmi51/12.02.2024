// import React, { useState, useEffect } from "react";
// //import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
// import { useSelector,useDispatch } from "react-redux";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { TextField } from "@mui/material";
// import { Button } from 'primereact/button';

// interface FormData {
//   id: string;
//   roomNo: string;
//   bedNo: string;
//    orgId: string,
//    available:boolean,
// }
// const BedCreation = () => {
//   const { organization } = useSelector((state: any) => state.Login);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState<FormData>({
//     id: "",
//     roomNo: "",
//     bedNo: "",
//     orgId:organization,
//     available:true,
//   });

//   const handleSave = async () => {if (!formData.roomNo || !formData.bedNo) {
//     alert("Please fill All The Fields");
//     return;
//   } console.log("Organization:", organization);
//     const requestBody = {
//       id: "",
//       roomNo: formData.roomNo,
//       bedNo: formData.bedNo,
//       orgId:formData.orgId,
//       available:formData.available
//     };
//     try {
//       const response = await axios.post(
//         "http://47.32.254.89:7000/api/Q15Bed/create",
//         requestBody
//       );
//       console.log("Registered Data:", response.data);
//       console.log("Request details:", requestBody);
//       console.log('ID:',response.data.data.id)
//       if (
//         response.data.message &&
//         response.data.message.code === "MHC - 0200"
//       ) 
//       { 
//         // alert(response.data.message.description);
//         navigate(`/bed-table`); 
//       } else {
//         console.log("error:", response.data.message);
//         alert(`Error:${response.data.message.description}`);
//       }
//     } catch (error) {
//       console.log("Error:", error);
//     }
//   };
//   return (
//     <div className='row w-100' style={{marginTop:'60px'}}>
//     <div className='col-md-2'></div>
//     <div className='col-md-8'>
//     <h2 className='mb-2 text-center'>Bed Assign Details</h2>
//     <hr></hr>
//     <div className="row w-100" style={{marginTop:'40px'}}>
//           <div className='col-md-6 mb-2 mx-auto'>
//             <TextField id="outlined-basic-1" label="RoomNo" variant="outlined" fullWidth  onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })} className="text-center"/>
//           </div>
//           </div>
//           <div className="row w-100 " style={{marginTop:'20px'}}>
//           <div className='col-md-6 mb-2 mx-auto' >
//             <TextField id="outlined-basic-2" label="BedNo" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, bedNo: e.target.value })} />
//           </div>
//         </div>
        
//       <div className="d-flex gap-3 justify-content-end mt-4">
//           <Button label="Cancel" onClick={() => { navigate('/bed-table') }} severity="secondary" style={{ color: '#000', backgroundColor: '#fff', border: '2px solid #0f3995' }} />
//           <Button label="Save" style={{ backgroundColor: '#0f3995' }} onClick={handleSave} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BedCreation;


import React, { useState, useEffect } from "react";
//import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { Button } from 'primereact/button';

interface FormData {
  id: string;
  roomNo: string;
  bedNo: string;
   orgId: string,
   available:boolean,
}
const BedCreation = () => {
  const { organization } = useSelector((state: any) => state.Login);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    id: "",
    roomNo: "",
    bedNo: "",
    orgId:organization,
    available:true,
  });

  const handleSave = async () => {
    if (!formData.roomNo || !formData.bedNo) {
    alert("Please fill All The Fields");
    return;
  } 
 
  console.log("Organization:", organization);
    const requestBody = {
      id: "",
      roomNo: formData.roomNo,
      bedNo: formData.bedNo,
      orgId:formData.orgId,
      available:formData.available
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
        navigate(`/management/bed-table`); 
      } else {
        console.log("error:", response.data.message);
        alert(`Error:${response.data.message.description}`);
      }
    } catch (error) {
      alert("Room No and Bed No Already Exists");
    }
  };
  return (
    <div className='row w-100' style={{marginTop:'60px'}}>
    <div className='col-md-2'></div>
    <div className='col-md-8'>
    <h2 className='mb-2 text-center'>Bed Assign Details</h2>
    <hr></hr>
    <div className="row w-100" style={{marginTop:'40px'}}>
          <div className='col-md-6 mb-2 mx-auto'>
            <TextField id="outlined-basic-1" label="RoomNo" variant="outlined" fullWidth  onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })} className="text-center"/>
          </div>
          </div>
          <div className="row w-100 " style={{marginTop:'20px'}}>
          <div className='col-md-6 mb-2 mx-auto' >
            <TextField id="outlined-basic-2" label="BedNo" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, bedNo: e.target.value })} />
          </div>
        </div>
        
      <div className="d-flex gap-3 justify-content-end mt-4">
          <Button label="Cancel" onClick={() => { navigate('/management/bed-table') }} severity="secondary" style={{ color: '#000', backgroundColor: '#fff', border: '2px solid #0f3995' }} />
          <Button label="Save" style={{ backgroundColor: '#0f3995' }} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default BedCreation;