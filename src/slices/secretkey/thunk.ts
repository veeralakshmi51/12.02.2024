import axios from 'axios'
import { endLoading, startLoading } from '../login/reducer'
import { toast } from 'react-toastify'
const baseURL = 'http://47.32.254.89:7000/api'
const successCode = 'MHC - 0200'

export const SecretKeyVerify = async (body: any, userType: any, navigate: (p: string) => void, organization: string, dispatch: any, setSecretKey: React.Dispatch<React.SetStateAction<string>>) => {
    dispatch(startLoading());
    try {
        const response = await axios.post(`${baseURL}/user/verify`, body);
        if (response.data.message.code === successCode) {
            localStorage.setItem('authStaff', 'Verified');
            dispatch(endLoading());
            if (userType === "Admin") {
            navigate('/q15-staff-configuration');
            } else if (userType === "Super Admin") {
            navigate('/organization-details');
            } else if (userType === "System Admin") {
            navigate(`/organization-update/${organization}`);
            } else {
            navigate('/staff-table');
            }
        } else {
            toast.error(response.data.message.description);
            dispatch(endLoading());
            // Reset the secretKey state to clear input boxes
            setSecretKey("");
        }
        } catch (error) {
        dispatch(endLoading());
        console.error("Error during login:", error);
        toast.error("An error occurred during login.");
        }
    };
    