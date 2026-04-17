import axios from "axios"
import { CompanyProfile } from "../types/types";
import { ApiError } from "../error/ApiError";

type props = {
    symbol: string,

}

export default async function getCompanyInformation({symbol}: props): Promise<CompanyProfile>{
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetCompanyDetails/${symbol}`)
        console.log(result.data)
        console.log(symbol)

        if(result.data.profile.hasError){
            throw new ApiError(result.data.profile.errorCode)
        }
        
        return result.data.profile.data;

    }
    catch(error){
        if(error instanceof ApiError) throw error

        throw new ApiError(-1)

    }

}
