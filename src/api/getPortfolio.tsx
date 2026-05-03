import axios from "axios";
import getStockImage from "./getStockImage";
import getStockName from "./getStockName";
import { ApiError } from "../error/ApiError";
import { IncompleteStock, UserPortfolio } from "../types/types";

export const imageMap = new Map()
export const nameMap = new Map()

export default async function getPortfolio(userid: number): Promise<UserPortfolio> {

  try {
    const response = await axios.get(`https://tradingsim-backend.onrender.com/api/portfolio/${userid}`);

    if(!response.data){
      throw new ApiError(response.status)
    }

    const stocks = await Promise.all(
      response.data.stocks.map(async (stock: IncompleteStock) => {
        try {
          let imageRes
          let nameRes

          if(imageMap.has(stock.symbol)) imageRes = imageMap.get(stock.symbol)
          else {
            imageRes = await getStockImage(stock.symbol)
            imageMap.set(stock.symbol, imageRes)
          }

          if(nameMap.has(stock.symbol)) nameRes = nameMap.get(stock.symbol)
          else {
            nameRes = await getStockName(stock.symbol);
            nameMap.set(stock.symbol, nameRes)
          }

          return {
            ...stock,
            logo: imageRes,
            name: nameRes
          };
        } catch (error) {
          if(error instanceof ApiError) throw error
          throw new ApiError(-1)
        }
      })
    );

    return {
      ...response.data,
      stocks,
    };
  } 
  catch (err) {
    
    if(err instanceof ApiError) throw err

    if(axios.isAxiosError(err)){
      if(err.response) throw new ApiError(err.response.status)
    }

    throw new ApiError(-1)
      
    }
}

