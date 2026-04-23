import axios from "axios"
import { ApiError } from "../error/ApiError";
import { MarketNews } from "../types/types";

type props = {
    symbol: string,
}

export default async function getStockNews({symbol}: props): Promise<MarketNews[]>{
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetStockNews/${symbol}`)

        if(result.data.hasError) throw new ApiError(result.data.errorCode)
        
        return result.data.data;

    }
    catch(error){
        if(error instanceof ApiError) throw error

        if(axios.isAxiosError(error)){
            if(error.response) throw new ApiError(error.response.status)    
        }

        throw new ApiError(-1)
    }
}

