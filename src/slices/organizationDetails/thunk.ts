import axios from "axios";
import { getOrganizationDetailsSuccess,isLoading,setIsLoadingFalse,setErrorMessage } from "./reducer";
import { toast } from "react-toastify";

const baseURL = 'http://47.32.254.89:7000/api'
const successCode = 'MHC - 0200'

export const getAllOrganizationDetails =()=>async(dispatch:any)=>{
    dispatch(isLoading())
    try{
        const response=await axios.get(`${baseURL}/org/getAll`)
        console.log("API Response:",response.data)
        if(response.data.message.code===successCode){
          dispatch(setIsLoadingFalse())
            dispatch(getOrganizationDetailsSuccess(response.data.data))
        } else{
          dispatch(setIsLoadingFalse())
            console.log(response.data.message.description)
        } 
    }
    catch(error){
        dispatch(setIsLoadingFalse())
        console.log("API error:",error)
    }
}

export const updateOrganizationDetails = (id: string, data: any) => async (dispatch: any) => {
  dispatch(isLoading());
  console.log("Updating organization with ID:", id);
console.log("Data to be sent:", data);
  try {
    const response= await axios.put(`${baseURL}/org/update/${id}`, data);
    console.log("Update API Response:",data);
    if (response.data.message.code === successCode) {
      dispatch(setIsLoadingFalse())
      dispatch(getAllOrganizationDetails());
      toast.success(response.data.message.description) 
    } else {
      dispatch(setIsLoadingFalse())
      toast.error(response.data.message.descryption) 
      dispatch(setErrorMessage(response.data.message.description));
    }
  } catch (error) {
    dispatch(setIsLoadingFalse())
    dispatch(setIsLoadingFalse());
    // console.log("API error:", error);
    toast.error("Error: something went wrong.")
  }
};

  export const deleteOrganizationDetails = (id: string) => async (dispatch: any) => {
    dispatch(isLoading());
    try {
        const response = await axios.delete(`${baseURL}/org/delete/${id}`);
        console.log("Delete API Response:", response.data);
        if (response.data.message.code === successCode) {
            dispatch(getAllOrganizationDetails());
            toast.success(response.data.message.description)
        } else {
            dispatch(setErrorMessage(response.data.message.description));
            toast.error(response.data.message.description)
        }
    } catch (error) {
        dispatch(setIsLoadingFalse());
        // console.log("API error:", error);
        toast.error("Error: something went wrong.")
    }
};
