import axios from "axios";
import { ApiError } from "../error/ApiError";

type props = {
    friendId: number;
}

export default async function DeleteFriend({friendId}: props){
 try{
        const token = localStorage.getItem("token");
        const result = await axios.delete(`https://tradingsim-backend.onrender.com/api/User/Delete-Friend/${friendId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        if(result.data.hasError) throw new ApiError(result.data.errorCode)
        
        return result.data.data;

    }
    catch(error){
        if(error instanceof ApiError) throw error
        
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if(error.response?.status === 401) throw new ApiError(4010)
                throw new ApiError(error.response.status ?? -1);
            }
        }
        throw new ApiError(-1)
    }

}
