import axios from "axios";
import { ApiError } from "../error/ApiError";

type props = {
  stockSymbol: string,
  quantity: number,
}

export default async function buyStock({stockSymbol, quantity}: props){

  const stockPurchaseRequest = {
    symbol: stockSymbol,
    quantity,
  };

  try {

    const token = localStorage.getItem("token");
    const response = await axios.post(
      `https://tradingsim-backend.onrender.com/api/portfolio/stocks/buy`,
        stockPurchaseRequest, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      }
    );

    return response.data

  } 
  catch (error) {
    if (error instanceof ApiError) throw error

    if(axios.isAxiosError(error)){
      if(error.response?.status === 401) throw new ApiError(4010)
      if(error.response) throw new ApiError(error.response.status)
    }

    throw new ApiError(-1)
  }
}