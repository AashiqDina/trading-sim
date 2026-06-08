import axios from "axios"
import { ApiError } from "../error/ApiError";
import { PortfolioStock } from "../types/types";

export default async function deleteStock(stockId: number): Promise<PortfolioStock>{
    try{
        const token = localStorage.getItem("token");
        const result = await axios.delete(`https://tradingsim-backend.onrender.com/api/portfolio/stocks/delete/${stockId}`, {
                headers:
                    {
                        Authorization: `Bearer ${token}`
                    }
            }
        )
        return result.data
    }
    catch(err){
        if(err instanceof ApiError) throw err

        if(axios.isAxiosError(err)){
            if(err.response?.status === 401) throw new ApiError(4010)
            if(err.response) throw new ApiError(err.response.status)
        }

        throw new ApiError(-1)
    }

}