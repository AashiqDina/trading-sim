import axios from "axios";
import { ApiError } from "../error/ApiError";

export default async function getAllUsers(){
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/User/List`)
        console.log(result.data)
        return result.data
    }
    catch(error){

        if(error instanceof ApiError) throw error

        if(axios.isAxiosError(error)){
            if(error.response) throw new ApiError(error.response.status)
        }

        throw new ApiError(-1)
    }
}
