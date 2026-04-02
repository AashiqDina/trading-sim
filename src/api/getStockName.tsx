import axios from "axios"
import { ApiError } from "../error/ApiError";

export default async function getStockName(symbol: string){
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetStockName/${symbol}`)

        if(result.data.hasError) throw new ApiError(result.data.errorCode)
        return result.data.data

    }
    catch(err){
        if(axios.isAxiosError(err)){
            if(err.response) throw new ApiError(err.response.status)
            
        }

        if(err instanceof ApiError) throw err

        throw new ApiError(-1)
    }

}