import axios from "axios"
import { ApiError } from "../error/ApiError"

export default async function getStockInfoLastUpdated(symbol: string){
    try{
        let LastUpdatedDictionary = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetStockInfoLastUpdated/${symbol}`)
        return LastUpdatedDictionary.data.data
    }
    catch(error){
        if(axios.isAxiosError(error)){
            if(error.response) throw new ApiError(error.response.status)
        }
        else{
            throw new ApiError(-1)
        }
    }
}
