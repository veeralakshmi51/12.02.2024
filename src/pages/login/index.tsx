import React, { useEffect, useRef, useState } from "react";
import LoginImage from "../../assets/images/login.png";
import MHCLogo from "../../assets/images/mettlerTitle.png"
import { Link, useNavigate } from "react-router-dom";
import { getOrganization, handleLogin } from "../../slices/thunk";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { AccountCircle, Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import Loader from "../../components/loader/Loader";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const usernameInputRef = useRef<HTMLInputElement | null>(null);
  const { loading } = useSelector(
    (state: any) => state.Login
  );
  useEffect(() => {
    getOrganization(dispatch);
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, [dispatch]);

  const triggerLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = {
      username,
      password,
      organization: orgName,
    };
    handleLogin(dispatch, body, navigate);
  };
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleForget = () => {
    navigate('/forgot-password')
  }
  return (
    <div className="row h-100 w-100">
      {loading && <Loader />}
      <div className="col-md-7 position-relative p-0">
        <div >
          <p className="position-absolute" style={{ color: '#fff', fontWeight: 'bold', fontSize: '30px', marginLeft: '100px', marginTop: '360px' }}>Welcome to <br />Mettler Health</p>
          <p className="position-absolute" style={{ color: '#fff', fontSize: '15px', marginLeft: '100px', marginTop: '470px' }}>we specialize in developing cutting-edge <br /> software solutions for the healthcare industry.</p>
          <img className="position-absolute" style={{ height: '25px', width: '200px', marginLeft: '70px', marginTop: '80px' }} src={MHCLogo} alt="MHC Logo" />
          <img
            src={LoginImage}
            alt="LogIn Image"
            className="img-fluid"
            style={{ objectFit: "cover", height: '100vh' }}
          />
        </div>
      </div>
      <div className="col-md-5 d-flex flex-column align-items-center justify-content-md-center">
        <form className="rounded col-md-9"  onSubmit={triggerLogin}>

          <div className="d-flex flex-column">
            <div>
              <p style={{ fontSize: '24px', color: '#415076' }}>Hello!</p>
            </div>
            <div className="mb-2">
            <p style={{ fontSize: '18px', color: '#415076' }}>Login into your account</p>
            </div>
            <div className="d-flex flex-column gap-3">
              <TextField
                id="outlined-basic-1"
                label="Username"
                variant="outlined"
                fullWidth
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle style={{ color: "#9F9FA2" }} />
                    </InputAdornment>
                  ),
                }}
                inputRef={(input) => {
                  usernameInputRef.current = input;
                }}
              />

              <TextField
                id="outlined-basic-2"
                label="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock style={{ color: "#9F9FA2" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handlePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

            </div>
          </div>
          <div className="d-flex mt-2 row">
            <div className="col-md-1"></div>
            <div className="form-check col-md-4 p-0" style={{textAlign:'start'}}>
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
              />
              <label className="form-check-label" style={{ fontSize: '14px' }} htmlFor="exampleCheck1">
                Remember Me
              </label>
            </div>
            <div className="col-md-2"></div>
            <div className="col-md-5">
              <p className="text-end" style={{ color:'#2D70F4',cursor: 'pointer',fontSize:'14px' }} onClick={handleForget}>Forgot Password?</p>
            </div>
          </div>
          <button
              type="submit"
              className="btn btn-primary col-md-12"
              style={{ height: "56px" }} // Adjust the height as needed
            >
              Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;