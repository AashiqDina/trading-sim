import { ApiError } from "../error/ApiError";


export default async function handleDeleteStockFromPortfolio(username: string, password: string){

    try{

    }
    catch(err){
        if(err instanceof ApiError) throw err

        throw new ApiError(0)
    }
}