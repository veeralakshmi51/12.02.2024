import "./header.css";
import LogoImg from "../../assets/images/mettlerTitle.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { handleLogout } from "../../slices/thunk";
import React, { useState, useEffect } from "react";
import { PersonAdd, Logout, LockReset } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { TextField } from "@mui/material";
interface HeaderProps {
  currentPage: string;
  subPage: string;
}
const Header: React.FC<HeaderProps> = ({ currentPage, subPage }) => {
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    const given = localStorage.getItem("given");
    const family = localStorage.getItem("family");
    if (given && family) {
      setGivenName(given);
      setFamilyName(family);
    }
  }, []);
  useEffect(() => {
    const userEmail = localStorage.getItem("userDetailEmail");
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if event.target is not null before proceeding
      if (
        event.target &&
        open &&
        !(event.target as Element).closest(".menu-container")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open1 = Boolean(anchorEl);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/login";
  const isSecretKeyPage = location.pathname === "/secret-key";
  const isForgotPassword = location.pathname === "/forgot-password";
  const isChangePassword = location.pathname === "/change-password";
  const isVerifyOTP = location.pathname === "/verify-otp";
  const isResetSecret = location.pathname === "/resetSecretKey";
  const isReCreatePassword = location.pathname === "/recreatePassword";
  const { jwt, userType, organization, userDetails } = useSelector(
    (state: any) => state.Login
  );
  const username = useSelector((state: any) => state.Login.userDetails);
  const { name } = useSelector((state: any) => state.Login.userDetails);
  const [modal, setModal] = useState(false);
  // Check if the current page is neither login nor secret-key
  const showLogoImg =
    !isLoginPage &&
    !isSecretKeyPage &&
    !isForgotPassword &&
    !isChangePassword &&
    !isVerifyOTP &&
    !isResetSecret;
  const showAvatar =
    !isLoginPage &&
    !isSecretKeyPage &&
    !isForgotPassword &&
    !isChangePassword &&
    !isVerifyOTP &&
    !isResetSecret;
  const showHeader =
    !isLoginPage &&
    !isSecretKeyPage &&
    !isForgotPassword &&
    !isChangePassword &&
    !isVerifyOTP &&
    !isResetSecret &&
    !isReCreatePassword;

  if (!showHeader) {
    return null; // Do not render the header on login and secret-key pages
  }
  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      console.log(jwt, username);
      const body = {
        jwt,
        username,
      };
      handleLogout(body, navigate);
    }
  };

  const handleChangePassword = () => {
    setOpen(!open);
    navigate("/recreatePassword");
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileCheck = () => {
    setModal(!modal);
  };
  console.log("Name array:", `${givenName} ${familyName}`);

  const role = userDetails?.role || "";
  const mobilePhone=userDetails?.contact?.[0]?.mobilePhone || "";
  const dateOfBirth = userDetails?.dateofBirth || "";
  const gender = userDetails?.gender || "";
  const ssn = userDetails?.ssn || "";
  const npi = userDetails?.npi || "";
  return (
    <div
      className={"row mHeader d-flex justify-content-center align-items-center"}
    >
      <div className="col-sm-1"></div>
      <div className="col-sm-3">
        <h5>
          {currentPage ? (
            <h5 style={{ color: "white" }}>{currentPage} </h5>
          ) : (
            <h5 style={{ color: "white" }}>{subPage}</h5>
          )}
        </h5>
      </div>
      <div className="col-sm-4 d-flex justify-content-center">
        {showLogoImg && (
          <img
            src={LogoImg}
            alt="Logo"
            className="img-fluid d-flex justify-content-center align-items-center"
            style={{ width: "200px", height: "25px" }}
          />
        )}
      </div>
      <div className="col-sm-4 d-flex justify-content-end">
        <Box>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              {/* <FaUserCircle style={{ width: 32, height: 32, color:'grey' }}/> */}
              <Avatar
                sx={{ width: 32, height: 32, backgroundColor: "#9F9FA2" }}
              >
              {/* {username.charAt(0).toUpperCase()} */}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </div>
      {/* <div className={`dropdown-menu ${open ? "active" : "inactive"}`} >
          <h5 style={{color:'green',textAlign:'center'}}>{username}</h5>
          <p style={{color:'red',textAlign:'center'}}>{userType}</p>
          <ul>
            <li role='button' className='text-primary' onClick={handleChangePassword}>
                <LockReset />
                Change Password
            </li>
            <li role='button' className='text-primary' onClick={handleLogoutClick}>
              <ExitToApp />
              Logout
            </li>
          </ul>
        </div> */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open1}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleProfileCheck}>
          <Avatar />
          {userType === "Super Admin"
            ? username
            : `${givenName} ${familyName}`}{" "}
          <br /> {userType}
          <br />
          {organization}
        </MenuItem>

        <Divider />
        <MenuItem onClick={handleChangePassword}>
          <ListItemIcon>
            <LockReset fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>

        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Modal
        isOpen={modal}
        toggle={() => setModal(false)}
        centered
        style={{ fontFamily: "calibri", fontSize: "20px" }}
      >
        <ModalHeader toggle={() => setModal(false)}>User Details</ModalHeader>
        <ModalBody style={{ textAlign: "center", margin: "30px" }}>
          {/* <h5>UserName:{""}{username}</h5> */}
          {/* <h5>UserType:{""}{userType}</h5>
      <h5>Organization: {""} {organization}</h5> */}
          <div className="row w-100">
            <TextField
              id="outlined-basic-1"
              label="UserName"
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px" }}
              value={
                userType === "Super Admin"
                  ? `${username}`
                  : `${givenName} ${familyName}`
              }
            />
            <TextField
              id="outlined-basic-2"
              label="UserType"
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px" }}
              value={userType}
            />
          </div>
          <div className="row">
            <TextField
              id="outlined-basic-3"
              label="OrganizationID"
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px" }}
              value={organization}
            />
          </div>
          <div className="row">
            <TextField
              id="outlined-basic-4"
              label="Email"
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px" }}
              value={email}
            />
          </div>
          <div className="row">
            <TextField
              id="outlined-basic-5"
              label="Role"
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px" }}
               value={role}
            />
          </div>
          <div className="row">
            <TextField
              id="outlined-basic-6"
              label="Contact"
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px" }}
               value={mobilePhone}
            />
          </div>
          <div className="row">
            <TextField
            id="outlined-basic-7"
            label="DateOfBirth"
            fullWidth
            style={{marginBottom:'20px'}}
            value={dateOfBirth}
            />
          </div>
          <div className="row">
            <TextField
            id="outlined-basic-8"
            label="Gender"
            fullWidth
            style={{marginBottom:'20px'}}
            value={gender}
            />
          </div>
          <div className="row">
            <TextField id="outlined-basic-9"
            label="SSN"
            fullWidth
            style={{marginBottom:'20px'}}
            value={ssn}
            />
          </div>
          <div className="row">
            <TextField
            id="outlined-basic-8"
            label="NPI#"
            fullWidth
            style={{marginBottom:'20px'}}
            value={npi}/>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Header;
