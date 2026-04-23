import axios from "axios"
import { ApiError } from "../error/ApiError";
import { MarketNews } from "../types/types";

export default async function getMarketNews(): Promise<MarketNews[]> {
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetMarketNews`)

        if(result.data.hasError) throw new ApiError(result.data.errorCode)
        return result.data.data;

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