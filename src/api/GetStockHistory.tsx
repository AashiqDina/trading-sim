import axios from "axios"
import { ApiError } from "../error/ApiError";

export default async function GetStockHistory(symbol: string){
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetStocksFullHistory/${symbol}`)

        if(result.data.data.hasError) throw new ApiError(result.data.data.errorCode)
        return result.data.data.values

    }
    catch(error){
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

