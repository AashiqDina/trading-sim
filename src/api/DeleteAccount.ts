import axios from "axios";
import { ApiError } from "../error/ApiError";
import { useNavigate } from "react-router-dom";

type props = {
    userId: number;
    Confirmation: boolean
}

export default async function DeleteAccount({userId, Confirmation}: props){
    
    try{
        if(!Confirmation) throw new ApiError(9999)

        const result = await axios.delete(`https://tradingsim-backend.onrender.com/api/User/${userId}`)

        if(result.data.hasError) throw new ApiError(result.data.errorCode)

        return true
    }
    catch(error){
        console.log(error)
        if(error instanceof ApiError) throw error
        
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new ApiError(error.response.status);
            }
        }
        throw new ApiError(-1)
    }

}
