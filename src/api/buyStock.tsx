import axios from "axios";
import { ApiError } from "../error/ApiError";

type props = {
  userId: number,
  stockSymbol: string,
  quantity: number,
}

export default async function buyStock({userId, stockSymbol, quantity}: props){

  const stockPurchaseRequest = {
    symbol: stockSymbol,
    quantity,
  };

  try {

    const response = await axios.post(
      `https://tradingsim-backend.onrender.com/api/portfolio/${userId}/stocks`,
      stockPurchaseRequest
    );

    return response.data

  } 
  catch (error) {
    if (error instanceof ApiError) throw error

    if(axios.isAxiosError(error)){
      if(error.response) throw new ApiError(error.response.status)
    }

    throw new ApiError(-1)
  }
}