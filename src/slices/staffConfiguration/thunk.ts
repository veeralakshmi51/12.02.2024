import axios from "axios"
import { endLoading, getPSConfigSuccess, getRNInchargeListSuccess, getSocialWorkerListSuceess, setErrorMessage, startLoading } from "./reducer"
import { toast } from "react-toastify"

const baseURL = 'http://47.32.254.89:7000/api'
const successCode = 'MHC - 0200'
export const getPSConfigByDate = async (dispatch: any, date: any) => {
    dispatch(startLoading())
    try {
        const response = await axios.get(`${baseURL}/PSConfig/getByDate/${date}`)
        if (response.data.message.code === successCode) {
            dispatch(getPSConfigSuccess(response.data.data.shift))
            // toast.success(response.data.message.description)
        } else {
            dispatch(endLoading())
            // toast.error(response.data.message.description)
           dispatch(getPSConfigSuccess([]))

        }
    } catch (error) {
        dispatch(endLoading())
        // toast.error("Error: something went wrong.")
    }
}

export const getAllRNIncharge = async (dispatch: any, role: string, orgId: string) => {
    dispatch(startLoading())
    try {
       const response = await axios.get(`${baseURL}/staff/role/${role}/${orgId}`)
       if (response.data.message.code === successCode) {
        dispatch(getRNInchargeListSuccess(response.data.data))
        // toast.success(response.data.message.description)
       } else {
        dispatch(endLoading())
        // toast.error(response.data.message.description)
       }
    } catch (error) {
        dispatch(endLoading())
        // toast.error("Error: something went wrong.")
    }
}

export const getAllSocialWorkers = async (dispatch: any, role: string, orgId: string) => {
    dispatch(startLoading())
    try {
       const response = await axios.get(`${baseURL}/staff/role/${role}/${orgId}`)
       if (response.data.message.code === successCode) {
        dispatch(getSocialWorkerListSuceess(response.data.data))
        // toast.success(response.data.message.description)
       } else {
        // alert(response.data.message.description)
       }
    } catch (error) {
        dispatch(endLoading())
    //    toast.error("Error: something went wrong.")
    }
}

export const postPSConfig = async (dispatch: any) => {
    dispatch(startLoading())
    try {
        
    } catch (error) {
        dispatch(endLoading())
       toast.error("Error: something went wrong.")
    }
}