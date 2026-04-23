import axios from "axios";
import { ApiError } from "../error/ApiError";


export default async function GetStockList(): Promise<Record<string, {logo: string, symbol: string}>>{
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetStockList`)

        if(result.data.hasError) throw new ApiError(result.data.errorCode)
        return result.data;
    
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