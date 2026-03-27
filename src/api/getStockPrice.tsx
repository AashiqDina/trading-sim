import axios from "axios"
import { ApiError } from "../error/ApiError"

export default async function getStockPrice(symbol: string){
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/${symbol}`)
        if(result.data.response.hasError && result.data.response.errorCode == 404){ 
            throw new ApiError(1001)
        }
        if(result.data.response.hasError) throw new ApiError(result.data.response.errorCode)
        return result.data.response.data;

    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new ApiError(error.response.status);
            } else {
                throw new ApiError(-1);
            }
        }

        if (error instanceof ApiError) throw error;
        
        throw new ApiError(-1);
    }
}
