import axios from 'axios';
import { isLoading, setErrorMessage, setIsLoadingFalse, getPatientSuccess } from './reducer';
import { toast } from 'react-toastify';

const baseURL = 'http://47.32.254.89:7000/api';
const successCode = 'MHC - 0200';

export const getAllPatient = async (dispatch: any,org: string) => {
  dispatch(isLoading());
  try {
    const response = await axios.get(`${baseURL}/patient/get/activePatient/${org}`);

    if (response.data.message.code === successCode) {
      dispatch(getPatientSuccess(response.data.data));
      // toast.success(response.data.message.description)
    } else {
      dispatch(setErrorMessage(response.data.message.description));
      dispatch(getPatientSuccess([]));

      // toast.error(response.data.message.description)
    }
  } catch (error) {
    dispatch(setIsLoadingFalse());
    // toast.error("Error: something went wrong.")
    console.error(error);
  }
};

export const updatePatientDetails = (id: string, data: any, org: string) => async (
  dispatch: any
) => {
  dispatch(isLoading());
  console.log('Updating Patient with ID:', id);
  console.log('Data to be sent:', data);

  try {
    const response = await axios.put(`${baseURL}/patient/update/${id}`, data);

    console.log('Update API Response:', response.data);

    if (response.data.message.code === successCode) {
      dispatch(setIsLoadingFalse());
      //setEditModal(false);
      // console.log('Patient details updated successfully!');
      toast.success(response.data.message.description)
      
      getAllPatient(dispatch, org);
    } else {
      dispatch(setErrorMessage(response.data.message.description));
      // console.error('Update failed:', response.data.message.description);
      toast.error(response.data.message.description)
    }
  } catch (error) {
    dispatch(setIsLoadingFalse());
    // console.log('API error:', error);
    // console.error('API error:', error);
    toast.error("Error: something went wrong.")
  }
};

// export const deletePatientDetails = (username:string,org: string) => async (dispatch: any) => {
//   dispatch(isLoading());
//   try {
//     const response = await axios.delete(`${baseURL}/patient/delete/${username}`);
//     console.log('Delete Patient Details:', response.data);
//     if (response.data.message.code === successCode) {
//       getAllPatient(dispatch,org)
//         } else {
//       dispatch(setErrorMessage(response.data.message.description));
//     }
//   } catch (error) {
//     dispatch(setIsLoadingFalse());
//     console.log('API Error:', error);
//   }
// };


export const patientDischarge = async (dispatch: any,id:string,org:string) => {
  dispatch(isLoading());
  try {
    const response = await axios.post(`${baseURL}/patient/discharge/${id}`);

    if (response.data.message.code === successCode) {
      // dispatch(getPatientSuccess(response.data.data));
      // console.log(response.data.data)
      toast.success(response.data.message.description)
    } else {
      dispatch(setErrorMessage(response.data.message.description));
      dispatch(getPatientSuccess([]));
      toast.error(response.data.message.description)
    }
  } catch (error) {
    dispatch(setIsLoadingFalse());
    // console.error(error);
    toast.error("Error: something went wrong.")
  }
};