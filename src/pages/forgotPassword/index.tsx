import React, { useState, useEffect } from "react";
import Image2 from '../../assets/images/image2.png';
import mettler from '../../assets/images/mettler.jpg';
import { InputAdornment, TextField } from "@mui/material";
import { Button } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Email } from "@mui/icons-material";
import { toast } from "react-toastify";
interface Data{
  email:string;
}
const ForgotPassword = () => {
const [data,setData]=useState<Data>({
  email:"",
});
const navigate=useNavigate();


const handleRequest = async () => {
  try {
    const response = await axios.post('http://47.32.254.89:7000/api/user/forgot-password', data);
    console.log('Response:', response.data);

    if (response.data.message && response.data.message.code === 'MHC - 0200') {
    toast.success(response.data.message.description);
    localStorage.setItem('savedEmail', data.email);
      navigate('/verify-otp');
    }
  } catch (error:any) {
    if (error.response) {
      console.log('Server Error:', error.response.data);
      console.log('Status Code:', error.response.status);
      console.log('Headers:', error.response.headers);

      if (error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message.description}`);
      } else {
        
        toast.error('An unexpected error occurred. Please try again.');
      }
    } else if (error.request) {
      console.log('Request Error:', error.request);
      toast.error('Network issue. Please try again.');
    } else {
      console.log('Error:', error);

      toast.error('An unexpected error occurred. Please try again.');
    }
  }
};


  return (
    <div className="row w-100 h-100" >
      <div className="col-md-7 ">
        <img src={Image2} alt="Image"
          className="img-fluid"
          style={{ objectFit:"cover",height:'100vh' }}></img>
      </div>
      <div className="col-md-5 d-flex flex-column align-items-md-center justify-content-md-center">
      <div className="d-flex justify-content-center mb-2">
          <img className="p-0 "
          src={mettler}
          style={{ height: "-webkit-fill-available"}}
          alt="Image"
        ></img>
        </div>
      <form className="rounded col-md-8" style={{ padding: '30px' }} >

      <div className="d-flex flex-column">
        <label className="text-start" style={{width:'233px',height:'32px',fontSize:'21px',color:'#2E1B1B'}}>Forgot your password</label>
        <label className="text-start mb-5"style={{width:'286px',height:'20px',fontSize:'13px',color:'#545B82'}}>We’ll help you reset it and get back on track.</label>
      <TextField
        id="outlined-basic-1"
        label="Email"
        variant="outlined"
        fullWidth
        value={data.email}
        onChange={(e)=>setData({...data,email:e.target.value})}
        InputProps={{startAdornment:(<InputAdornment position="start"><Email style={{color:'#9F9FA2'}}/></InputAdornment>)}}
      />
      <Button className="mb-3 mt-3" color="primary" style={{ fontSize:'15px',height:'56px' }} onClick={handleRequest}>
              Click to Send OTP
            </Button>
            <div className="d-flex align-items-center justify-content-center">
              <p style={{cursor:'pointer',color:'#2D70F4'}} onClick={() => navigate(-1)}>Back to Login</p>
            </div>
      </div>
      </form>
      </div>
    </div>
   
  );
};

export default ForgotPassword;