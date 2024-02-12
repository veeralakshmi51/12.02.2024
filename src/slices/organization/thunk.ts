import axios from 'axios'
import { isLoading, setErrorMessage, setIsLoadingFalse, getShiftStartTimeSuccess, getShiftDurationSuccess, getOrgDataByIdSuccess } from "./reducer"
import { toast } from 'react-toastify';

const baseURL = 'http://47.32.254.89:7000/api'
const successCode = 'MHC - 0200'

export const getOrgByID = async (dispatch: any,orgId:string) => {
    dispatch(isLoading());
    try {
        const response = await axios.get(`${baseURL}/org/getById/${orgId}`);
        dispatch(setIsLoadingFalse())
      if (response.data.message.code === successCode) {
        dispatch(getOrgDataByIdSuccess(response.data.data))
        dispatch(getShiftStartTimeSuccess(response.data.data.shift.startTime));
        dispatch(getShiftDurationSuccess(response.data.data.shift.duration));
        // toast.success(response.data.message.description)
      } else {
        dispatch(setErrorMessage(response.data.message.description));
        // toast.error(response.data.message.description)
    dispatch(setIsLoadingFalse())
      }
    } catch (error) {
      dispatch(setIsLoadingFalse());
      // toast.error("Error: something went wrong.")
      // console.error(error);
    }
  };
