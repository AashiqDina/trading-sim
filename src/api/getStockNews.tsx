import axios from "axios"
import handleTwelveDataError from "../error/handleTwelveDataError";
import { ApiError } from "../error/ApiError";

type props = {
    symbol: string,
}

export default async function getStockNews({symbol}: props){
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetStockNews/${symbol}`)

        if(result.data.hasError) throw new ApiError(result.data.errorCode)
        
        return result.data.data;

    }
    catch(error){
        if(error instanceof ApiError) throw error

        throw new ApiError(-1)
    }
}

