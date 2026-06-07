import axios from "axios";
import { ApiError } from "../error/ApiError";

type props = {
    Confirmation: boolean
}

export default async function DeleteAccount({Confirmation}: props){
    try{
        if(!Confirmation) throw new ApiError(9999)

        const token = localStorage.getItem("token");
        const result = await axios.delete(`https://tradingsim-backend.onrender.com/api/User`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        if(result.data.hasError) throw new ApiError(result.data.errorCode)

        return true
    }
    catch(error){
        if(error instanceof ApiError) throw error
        
        if (axios.isAxiosError(error)) {
            if(error.response?.status === 401) throw new ApiError(4010)
            if (error.response) throw new ApiError(error.response.status ?? -1);
        }
        throw new ApiError(-1)
    }

}
