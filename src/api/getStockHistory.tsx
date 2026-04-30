import axios from "axios"
import { ApiError } from "../error/ApiError";
import { StockDetailsHistoryItem } from "../types/types";

export default async function getStockHistory(symbol: string): Promise<StockDetailsHistoryItem[]>{
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetStocksFullHistory/${symbol}`)

        if(result.data.data.hasError) throw new ApiError(result.data.data.errorCode)
        return result.data.data.values

    }
    catch(error){

        if (error instanceof ApiError) throw error;

        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new ApiError(error.response.status);
            }
        }

        throw new ApiError(-1);
    }

}

