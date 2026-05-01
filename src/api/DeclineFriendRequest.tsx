import axios from "axios";
import { ApiError } from "../error/ApiError";

type props = {
    userId: number | undefined,
    friendId: number
}

export default async function DeclineFriendRequest({userId, friendId}: props){
    try{
        if(!userId) throw new ApiError(1000)

        const result = await axios.post(`https://tradingsim-backend.onrender.com/api/User/Decline-Request/${userId}/${friendId}`)
        
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
