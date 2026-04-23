import axios from "axios"
import { ApiError } from "../error/ApiError"

export default async function getTrendingStocks(): Promise<string[]>{
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetTrendingStocks`)

        if(result.data.hasError) throw new ApiError(result.data.errorCode)
        return result.data.trendingStocks

    }
    catch (error) {

        if (error instanceof ApiError) throw error;

        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new ApiError(error.response.status);
            } 
        }


        throw new ApiError(-1);
    }

}