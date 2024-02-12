import React, { useState, useEffect } from "react";
import Image3 from "../../assets/images/image3.png";
import mettler from "../../assets/images/mettler.jpg";
import { InputAdornment, TextField } from "@mui/material";
import { Button } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Security, Lock,VerifiedUserSharp,Password,Visibility,VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { baseURL } from "../../configuration/url";
import './index.css'
import { toast } from "react-toastify";
interface Data {
  username: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
const RecreatePassword = () => {
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const[old,setOld]=useState(false);
  const[newpass,setNewpass]=useState(false);
const [confirmpass,setconfirmPass]=useState(false);
  const [data, setData] = useState<Data>({
   username:"",
   oldPassword:"",
   newPassword:'',
   confirmNewPassword:""
  });
  const navigate = useNavigate();
  // const baseURL = 'http://47.32.254.89:7000/api'
  // const successCode = 'MHC - 0200'

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setData((prevData) => ({ ...prevData, email: savedEmail }));
    } else {
      console.log("No Email found in local storage");
    }
  }, []);

  useEffect(() => {
    const savedUsername = localStorage.getItem("userDetailUsername");
    if (savedUsername) {
      setData((prevData) => ({ ...prevData, username: savedUsername }));
    } else {
      console.log("No username found in local storage");
    }
  }, []);
  const handleRequest = async () => {
    if (!data.newPassword || !data.confirmNewPassword || !data.username ||!data.oldPassword) {
      toast.error("Please fill the fields");
      return;
    } if(data.newPassword !== data.confirmNewPassword)
    {
      toast.error('New Password and Confirm Password Does not Match');
      return;
    }
    try {
      const response = await axios.post(
        `${baseURL}/user/recreatePassword`,
        data
      );
      console.log("Response:", response.data);
      if (response.data.message && response.data.message.code === "MHC - 0200"){
        // alert(response.data.message.description);
        toast.success(response.data.message.description)
        //alert("Password Changed");
        navigate('/login')
      } else toast.error(response.data.message.description)
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className="d-flex vh-100">
    <div className="col-md-7 position-relative p-0">
        <img className="p-0"
          src={Image3}
          style={{ height: "-webkit-fill-available", marginRight: "-7px" }}
          alt="Image"
        ></img>
      </div>
      <div className="col-md-5 d-flex flex-column align-items-md-center justify-content-md-center">
      <div className="d-flex justify-content-center mb-2">
          <img className="p-0 "
          src={mettler}
          style={{ height: "-webkit-fill-available"}}
          alt="Image"
        ></img>
        </div>
        <form
          className="rounded col-md-8 "
          style={{ padding: "30px" }}
        >
          <div className="d-flex flex-column justify-content-center gap-3">
            <label className="text-center">Change Password</label>
            <TextField
              id="outlined-basic-2"
              label="Username"
              variant="outlined"
              fullWidth
              disabled
              value={data.username}
              onChange={(e:any) =>
                setData({ ...data, username: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VerifiedUserSharp style={{ color: "#9F9FA2" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="outlined-basic-2"
              label="Old Password"
              variant="outlined"
              fullWidth
              type={old?"text":'password'}
              value={data.oldPassword}
              onChange={(e:any) =>
                setData({ ...data, oldPassword: e.target.value })
              }
              InputProps={{
                startAdornment: (<InputAdornment position="start"><Security style={{ color: "#9F9FA2" }} /></InputAdornment>),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setOld(!old)} edge="end">
                      {old ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              id="outlined-basic-2"
              label="New Password"
              variant="outlined"
              fullWidth
              type={newpass?"text":'password'}
              value={data.newPassword}
              onChange={(e:any) =>
                setData({ ...data, newPassword: e.target.value })
              }
              InputProps={{
                startAdornment: (<InputAdornment position="start"><Password style={{ color: "#9F9FA2" }} /></InputAdornment>),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setNewpass(!newpass)} edge="end">
                      {newpass ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              id="outlined-basic-3"
              label="Confirm Password"
              variant="outlined"
              fullWidth
              type={confirmpass?"text":'password'}
              value={data.confirmNewPassword}
              onChange={(e:any) =>
                setData({ ...data, confirmNewPassword: e.target.value })
              }
              InputProps={{
                startAdornment: (<InputAdornment position="start"><Lock style={{ color: "#9F9FA2" }} /></InputAdornment>),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setconfirmPass(!confirmpass)} edge="end">
                      {confirmpass ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              color="primary"
              style={{ fontSize: "15px",height: "56px" }}
              onClick={handleRequest}
            >
              Change Password
            </Button>
          </div>
        </form>
        <div>
          <p style={{color:'#0f3995' , cursor:'pointer'}} onClick={() => navigate(-1)}>Back</p>
        </div>
      </div>
    </div>
  );
};

export default RecreatePassword;
