import axios from "axios"
import { ApiError } from "../error/ApiError";

export default async function getAllStocksLastUpdated(): Promise<Record<string, string>>{
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetAllStockLastUpdated`)
        return result.data
    }
    catch(err){

        if(err instanceof ApiError) throw err

        if(axios.isAxiosError(err)){
            if(err.response) throw new ApiError(err.response.status)   
        }

        throw new ApiError(-1)
    }

}