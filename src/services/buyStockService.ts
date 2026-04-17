import { ApiError } from "../error/ApiError";
import buyStock from "../api/buyStock";

enum PurchaseError{
  INVALID_STOCK_QUANTITY = 1499,
  INVALID_STOCK_PRICE = 1500,
  ZERO_QUANTITY = 1501,
  QUANTITY_NEGATIVE = 1502,
  COST_TOO_MUCH = 1503,
}

type params = {
    stockPrice: number,
    quantity: number,
    stockSymbol: string,
    userId: number
}

export default async function buyStockService({stockPrice, quantity, stockSymbol, userId}: params){

    if (!Number.isFinite(stockPrice)) throw new ApiError(PurchaseError.INVALID_STOCK_PRICE);
    if (!Number.isFinite(quantity)) throw new ApiError(PurchaseError.INVALID_STOCK_QUANTITY);
    if (quantity === 0) throw new ApiError(PurchaseError.ZERO_QUANTITY);
    if (quantity < 0) throw new ApiError(PurchaseError.QUANTITY_NEGATIVE);
    if ((stockPrice*quantity) > 100000) throw new ApiError(PurchaseError.COST_TOO_MUCH);

    try{
        console.log(userId)
        return await buyStock({stockSymbol: stockSymbol, quantity: quantity, userId: userId})
    }
    catch(err){
        if(err instanceof ApiError) throw err

        throw new ApiError(-1)
    }
}

