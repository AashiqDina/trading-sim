import axios from "axios";
import { ApiError } from "../error/ApiError";

type props = {
  userId: number | undefined
}

export default function updateAllStocksInPortfolio({userId}: props){

  const UpdateAllStocksInPortfolio = async () => {
    try{
      if(!userId) throw new ApiError(1000)
      
      await axios.put(
        `https://tradingsim-backend.onrender.com/api/portfolio/${userId}/stocks/update`
      );   
    }
    catch(err){
      if(err instanceof ApiError) throw err

      if(axios.isAxiosError(err)){
        if(err.response) throw new ApiError(err.response.status)
      }

      throw new ApiError(-1)
    }
  }

    return UpdateAllStocksInPortfolio()

}
