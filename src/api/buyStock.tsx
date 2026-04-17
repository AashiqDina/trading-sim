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
    console.log("req", stockPurchaseRequest)
    console.log("userid: ", userId)
    const response = await axios.post(
      `https://tradingsim-backend.onrender.com/api/portfolio/${userId}/stocks`,
      stockPurchaseRequest
    );

    console.log(response)

    return response.data

  } 
  catch (error) {
    if (error instanceof ApiError) throw error

    throw new ApiError(-1)
  }
}