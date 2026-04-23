import axios from "axios"
import { ApiError } from "../error/ApiError";
import { PortfolioStock } from "../types/types";

export default async function deleteStock(userId: number, stockId: number): Promise<PortfolioStock>{
    try{
        const result = await axios.delete(`https://tradingsim-backend.onrender.com/api/portfolio/${userId}/stocks/delete/${stockId}`)
        return result.data
    }
    catch(err){
        if(err instanceof ApiError) throw err

        if(axios.isAxiosError(err)){
            if(err.response) throw new ApiError(err.response.status)
        }

        throw new ApiError(-1)
    }

}