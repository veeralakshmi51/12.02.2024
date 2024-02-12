import axios from 'axios'
import { isLoading, setErrorMessage, setIsLoadingFalse, getBeaconSuccess } from "./reducer"
import { toast } from 'react-toastify';

const baseURL = 'http://47.32.254.89:7000/api'
const successCode = 'MHC - 0200'

export const getAllBeacon = async (dispatch: any) => {
    dispatch(isLoading());
    try {
      const response = await axios.get(`${baseURL}/getAll`);
  
      if (response.data.message.code === successCode) {
        console.log(response.data.data)
        toast.success(response.data.message.description)
        dispatch(getBeaconSuccess(response.data.data));
       
      } else {
        console.log(response.data.data)
        dispatch(setErrorMessage(response.data.message.description));
        toast.error(response.data.message.description)
      }
    } catch (error) {
      dispatch(setIsLoadingFalse());
      // console.error(error);
      toast.error("Error: something went wrong.")
    }
  };

  export const updatedSensorDetails = async (dispatch: any, id: string, data: any,org:string) => {
    dispatch(isLoading());
    // console.log('Updating sensor with deviceName:',id);
    // console.log('Data to be sent:', data);
  
    try {
      const response = await axios.put(`${baseURL}/sensor/updateSensorTableByDeviceName/${id}`, data);
  
      // console.log('Update API Response:', response.data);
  
      if (response.data.message.code === successCode) {
        dispatch(setIsLoadingFalse());
        // console.log('Sensor details updated successfully!');
        // alert(response.data.message.description);
        toast.success(response.data.message.description)
        // window.location.reload();
        getAllBeacon(dispatch);
      } else {
        dispatch(setErrorMessage(response.data.message.description));
        // console.error('Update failed:', response.data.message.description);
        // alert(response.data.message.description);
        toast.error(response.data.message.description)
      }
    } catch (error) {
      dispatch(setIsLoadingFalse());
      // console.log('API error:', error);
      // dispatch(setErrorMessage('Error updating sensor details.'));
      toast.error("Error: something went wrong.")
    }
  };
  