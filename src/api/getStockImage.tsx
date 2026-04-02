import axios from "axios"
import { ApiError } from "../error/ApiError";

export default async function getStockImage(symbol: string){
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/StockImage/${symbol}`)

        if(result.data.image.hasError) throw new ApiError(result.data.image.errorCode)
        return result.data.image.data

    }
    catch(err){
        if(axios.isAxiosError(err)){
            if(err.response) throw new ApiError(err.response.status)
            
        }

        if(err instanceof ApiError) throw err

        throw new ApiError(-1)
    }

}