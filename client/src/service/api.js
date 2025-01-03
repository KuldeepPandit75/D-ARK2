import axios from "axios";
import { API_NOTIFICATION_MESSAGES, SERVICE_CALLS } from "../constants/config";
import { getAccessToken, getType } from "../utils/common-utils";

const API_URL= process.env.BACKEND_URL || "http://localhost:2020" ;

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
})

axiosInstance.interceptors.request.use(
    function(config){
        try {
            if(config.TYPE.params){
                config.url= config.url+"/"+config.TYPE.params;
            }else if(config.TYPE.query){
                config.params=config.TYPE.query;
            }
        } catch (error) {
            console.log(error.message)
        }
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    function(response){
        return processResponse(response);
    },
    function(error){
        return processError(error);
    }
)

///////////////
// If success -> return {isSuccess: true, data: Object}
// If fail -> return {isFailure: true, status: string, msg: string, code: int}
//////////////

const processResponse=(response)=>{
    if(response?.status===200){
        return {isSuccess: true, data: response.data}
    }else{
        return {
            isFailure: true,
            status: response?.status,
            msg: response?.msg,
            code: response?.code
        }
    }
}


///////////////
// If success -> return {isSuccess: true, data: Object}
// If fail -> return {isFailure: true, status: string, msg: string, code: int}
//////////////
const processError = (error)=>{
    if(error.response){
        //Request made and server responded with a status other
        //that falls out of the range 2.x.x
        console.log("ERROR IN RESPONSE: ",error.toJSON())
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.responseFailure,
            code: error.response.status
        }
    }else if(error.request){
        //Request made but no response was received
        console.log("ERROR IN REQUEST: ",error.toJSON())
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.requestFailure,
            code: ""
        }
    }else{
        // something happened in setting up request that triggers an error
        console.log("ERROR IN NETWORK: ",error.toJSON())
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.networkFailure,
            code: ""
        }
    }
}

const API ={};

for (const [key,value] of Object.entries(SERVICE_CALLS)){
    API[key]=(body, showUploadProgress, showDownloadProgress)=>
        axiosInstance({
            method: value.method,
            url: value.url,
            data: body,
            responseType: value.responseType,
            headers: {
                Authorization: getAccessToken(),
                "Content-Type": "application/json"
            },
            TYPE: getType(value,body),
            onUploadProgress: function(progressEvent){
                if(showUploadProgress){
                    let percentageCompleted= Math.round((progressEvent.loaded*100)/progressEvent.total)
                    showUploadProgress(percentageCompleted);
                }
            },
            onDownloadProgress: function(progressEvent){
                if(showDownloadProgress){
                    let percentageCompleted= Math.round((progressEvent.loaded*100)/progressEvent.total)
                    showDownloadProgress(percentageCompleted);
                }
            }
        })
}

export {API};