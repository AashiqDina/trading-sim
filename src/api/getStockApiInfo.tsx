import axios from "axios"
import { ApiError } from "../error/ApiError";
import { StockQuoteData } from "../types/types";

type props = {
    symbol: string,
}

export default async function getStockApiInfo({symbol}: props): Promise<StockQuoteData>{
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetStockQuoteInfo/${symbol}`)

        if(result.data.hasError) throw new ApiError(result.data.errorCode)
        console.log(result.data.quoteData.data)

        return result.data.quoteData.data
    }
    catch(error){
        if ((error instanceof ApiError)) throw error

        if(axios.isAxiosError(error)){
        if(error.response) throw new ApiError(error.response.status)
        }

        throw new ApiError(-1)
    }

}
