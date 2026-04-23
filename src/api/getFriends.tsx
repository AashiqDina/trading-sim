import axios from "axios";
import { ApiError } from "../error/ApiError";
import { friendListMember } from "../types/types";

type props = {
    userId: number
}

export default async function getFriends({userId}: props): Promise<friendListMember[]>{
 try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/User/Get-Friends/${userId}`)
        console.log(result.data)
        if(result.data.hasError) throw new ApiError(result.data.errorCode)

        return result.data.data;
    }
    catch(error){
        if(error instanceof ApiError) throw error
        
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new ApiError(error.response.status);
            }
        }
        throw new ApiError(-1)
    }
}
