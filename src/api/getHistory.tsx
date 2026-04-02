import axios from "axios";
import { ApiError } from "../error/ApiError";

type Props = {
  id: number;
  filterHistory: string;
};

export default async function getHistory({id, filterHistory}: Props) {

    try{
      const result = await axios.get(`https://tradingsim-backend.onrender.com/api/portfolio/stocks/getHistory/${id}?range=${filterHistory}`)

      return result.data
    }
    catch(err){
      if(axios.isAxiosError(err)){
        if(err.response) throw new ApiError(err.response.status)
      }
      if(err instanceof ApiError) throw err

      throw new ApiError(-1)
        
    }
}