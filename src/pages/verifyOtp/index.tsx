// import React, { useState, useEffect, useRef } from "react";
// import Image5 from '../../assets/images/image5.png';
// import { TextField } from "@mui/material";
// import { Button } from "reactstrap";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { baseURL } from "../../configuration/url";
// import { toast } from "react-toastify";
// interface Data{
//   email:string;
//   otp:string;
// }
// const VerifyOtp= () => {
// const [data,setData]=useState<Data>({
//   email:"",
//   otp:"",
// });
// const navigate=useNavigate();
// const otpRef=useRef<HTMLInputElement[]>([]);
// const [verifyotp,setVerifyOtp]=useState("");

// useEffect(() => {
//   const savedEmail = localStorage.getItem('savedEmail');
//   if (savedEmail) {
//     setData((prevData) => ({ ...prevData, email: savedEmail }));
//   } else {
//     console.log('No Mail Found in Local Storage');
//   }
// }, []);

//  const handleRequest=async()=>{
//   try{
//     const response=await axios.post(`${baseURL}/user/verify-otp`,data);
//     // console.log('Response:',response.data);
//     // alert(response.data.message.description);
//     if(response.data.message && response.data.message.code === 'MHC - 0200'){
//       toast.success(response.data.message.description)
//     navigate('/change-password');
//     } else toast.error(response.data.message.description)
//   } catch(error){
//     console.log('Error:',error)
//     toast.error("Error: something went wrong.")
//   }
//  }

//  const handleOtpChange=(index:number,value:string)=>{
//   const verifyOtp=data.otp.split("");
//   verifyOtp[index]=value;
//   setVerifyOtp(verifyOtp.join(""));

//   if(index<otpRef.current.length-1 && value!==""){
//     otpRef.current[index+1].focus();
//   }
//  }

//  const handleBackSpace=(index:number,e:React.KeyboardEvent<HTMLInputElement>)=>{
//  if(e.key==="Backspace"){
//   const newOtp=data.otp.split("");
//   newOtp[index]="";
//   setVerifyOtp(newOtp.join(""));

//   if(index>0){
//     otpRef.current[index-1].focus();
//   }
//  }
//  }
// //  useEffect(()=>{
// //   otpRef.current[0].focus();
// // })
// useEffect(() => {
//   otpRef.current.forEach((input, index) => {
//     input.value = verifyotp[index] || '';
//   });
// }, [verifyotp]);

//   return (
//     <div className="p-grid passcode-section p-0 m-0" style={{ background: '#fff' }}>
//       <div className="p-col-12 p-md-7" style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column', marginLeft: '-6px'}}>
//         <img src={Image5} style={{ height: '-webkit-fill-available', marginRight: '-7px' }} alt="Image"></img>
//       </div>
//       <div className="col-md-5 d-flex flex-column align-items-md-center justify-content-md-center">
//       <form className="rounded col-md-8" style={{ border: '1px solid #6994f0', padding: '30px' }} >

//       <div className="d-flex flex-column gap-3">
//         <label>OTP Verification</label>
      
//       {/* <TextField
//       id="outlined-basic-2"
//       label="OTP"
//       variant="outlined"
//       fullWidth
//       value={data.otp}
//       type="password"
//       onChange={(e)=>setData({...data,otp:e.target.value})}/> */}
//       <div className="p-4 d-flex gap-3">
//         {[0,1,2,3,4,5].map((index)=>(
//           <input
//           key={index}
//           id={`otp${index}`}
//           type="password"
//           className={`passwordText${index+1}`}
//           name="otp"
//           onChange={(e)=>handleOtpChange(index,e.target.value)}
//           onKeyDown={(e)=>handleBackSpace(index,e)}
//           maxLength={1}
//           style={{
//             width:'40px',
//             height:'40px',
//             display:'flex',
//             justifyContent:'center',
//             alignItems:'center',
//             border:'1px solid #0f3995',
//             textAlign:'center',
//             borderRadius:'8px'
//           }}
//           ref={(ref)=>{
//             if(ref){
//               otpRef.current[index]=ref;
//             }
//           }}
//           ></input>
//         ))}
//       </div>
//       <Button color="info" style={{fontSize:'20px'}} onClick={handleRequest}>
//               Verify OTP
//             </Button>
//       </div>
//       </form>
//       </div>
//     </div>
   
//   );
// };

// export default VerifyOtp;


import React, { useState, useEffect ,useRef} from "react";
import Image5 from '../../assets/images/image5.png';
import mettler from '../../assets/images/mettler.jpg';
import { TextField, InputAdornment } from "@mui/material";
import { Button } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../configuration/url";

interface Data {
  email: string;
  otp: string;
}

const VerifyOtp = () => {
  const [data, setData] = useState<Data>({
    email: "",
    otp: "",
  });
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setData((prevData) => ({ ...prevData, email: savedEmail }));
    } else {
      console.log('No Mail Found in Local Storage');
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const updatedOtp = data.otp.substring(0, index) + value + data.otp.substring(index + 1);
    setData({ ...data, otp: updatedOtp });
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleRequest = async () => {
    try {
      const response = await axios.post(`${baseURL}/user/verify-otp`, data);
      console.log('Response:', response.data);
      alert(response.data.message.description);
      if (response.data.message && response.data.message.code === 'MHC - 0200') {
        navigate('/change-password');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div className="row passcode-section p-0 m-0" >
      <div className="col-md-6" style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column', marginLeft: '-6px', height: '101%' }}>
      <img src={Image5} className="img-fluid"
            style={{ objectFit: "cover", height: '100vh' }} alt="Image"></img>
      </div>
      <div className="col-md-6 d-flex flex-column align-items-md-center justify-content-md-center">
      <div className="d-flex justify-content-center mb-2">
          <img className="p-0 "
          src={mettler}
          style={{ height: "-webkit-fill-available"}}
          alt="Image"
        ></img>
        </div>
        <form className="rounded col-md-8" style={{ padding: '50px' }} >
          <div className="d-flex flex-column gap-4">
            <h4 className="text-center">OTP Verification</h4>
            <div className="d-flex gap-3" >
              {[...Array(6)].map((_, index) => (
                <TextField
                  key={index}
                  variant="outlined"
                  value={data.otp[index] || ""}
                  type="text"
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  inputProps={{ maxLength: 1 }}
                  style={{ flex: 1,border:'1px solid #0f3995',borderRadius:'8px'}}
                  inputRef={(ref) => (inputRefs.current[index] = ref)}

                />
              ))}
            </div>
            <Button color="info" style={{ fontSize: '20px' }} onClick={handleRequest}>
              Verify OTP
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;