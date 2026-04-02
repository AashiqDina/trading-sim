import axios from "axios"
import { ApiError } from "../error/ApiError";

export default async function deleteStock(userId: number, stockId: number){
    try{
        const result = await axios.delete(`https://tradingsim-backend.onrender.com/api/portfolio/${userId}/stocks/delete/${stockId}`)
        return result.data
    }
    catch(err){
        if(axios.isAxiosError(err)){
            if(err.response) throw new ApiError(err.response.status)
            
        }

        if(err instanceof ApiError) throw err

        throw new ApiError(-1)
    }

}