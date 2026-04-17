import { useCallback, useState } from "react"
import { PortfolioStock } from "../types/types"
import { ApiError } from "../error/ApiError"
import getPortfolio from "../api/getPortfolio"
import getAllStocksLastUpdated from "../api/getAllStocksLastUpdated"

type props = {
    user: number | undefined
    symbol: string
    setErrorCode: (code: number | null) => void
}

export function useStockDetailsOwnedStocks({symbol, user, setErrorCode}: props){
    const [ownedStocksLoading, setLoading] = useState<boolean>(false)
    const [ownedStocks, setOwnedStocks] = useState<PortfolioStock[]>([])
    const [lastUpdated, setLastUpdated] = useState<Map<string, Date>>(new Map())

    const fetchOwnedStocks = useCallback(async () => {
        try{
            if(user === undefined) throw new ApiError(1000) 

            setLoading(true)
            const [Portfolio, LastUpdated] = await Promise.all([
                await getPortfolio(user),
                await getAllStocksLastUpdated()
            ])
            const userOwnedStocks = Portfolio.stocks.filter((stock) => 
                stock.symbol === symbol
            )
            const map = new Map<string, Date>(
                Object.entries(LastUpdated.data).map(([key, value]) => [key, new Date(value as string)
            ]));
            setOwnedStocks(userOwnedStocks)
            setLastUpdated(map)
        }
        catch(err){
            if (err instanceof ApiError) setErrorCode(err.code)
            else setErrorCode(-1)
        }
        finally{
            setLoading(false)
        }
    }, [symbol, user])


    return { ownedStocksLoading, ownedStocks, lastUpdated, fetchOwnedStocks}
}