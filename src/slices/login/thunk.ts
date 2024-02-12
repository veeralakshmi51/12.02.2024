import axios from 'axios';
import { endLoading, saveLoginData, saveOrganization, saveUserDetails, saveUserType, startLoading } from './reducer'
import { toast } from 'react-toastify';

const baseURL = 'http://47.32.254.89:7000/api'
const successCode = 'MHC - 0200'

export const handleLogin = async (dispatch: any, body: any, navigate: (p: string) => void) => {
    dispatch(startLoading())
    try {
        const response = await axios.post(`${baseURL}/user/signin`, body);
        console.log("Login response:", response);
      
        if (response.data.message.code === successCode) {
            const { jwt, session, userType, organization,userDetail} = response.data.data;
            const userEmail=userDetail ? userDetail.email:null;
            const username = session.username;
            localStorage.setItem('userDetailEmail',userEmail);
            localStorage.setItem('userDetailUsername', username);
            dispatch(saveLoginData(jwt.jwtToken));
            dispatch(saveUserType(userType[0]));
            dispatch(saveUserDetails(username));
            dispatch(saveOrganization(organization));
            toast.success(response.data.message.description)
            navigate('/secret-key');
            if(userType != "Super Admin") {
                const userEmail=response.data.data.userDetail.email;
                localStorage.setItem('userDetailEmail',userEmail);
                window.localStorage.setItem('LoginData', response.data.data.userDetail.id);
                }
        } else {
            toast.error(response.data.message.description);
            dispatch(endLoading())
        }
    } catch (error) {
        // toast.error("Error during login:");
        dispatch(endLoading())
    }
};

export const handleLogout = async(body: any, navigate: (p: string) => void) => {
    
    try {
        const response = await axios.post(`${baseURL}/user/signout`,body);
        console.log("Logout :" , response);

        if(response.data.message.code === successCode) {
            localStorage.clear()
            navigate('/login')
        }else {
            // alert("Login failed: " + response.data.message.description);
            localStorage.clear()
            navigate('/login')
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}