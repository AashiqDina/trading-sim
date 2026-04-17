import { useCallback, useState } from "react"
import { ApiError } from "../error/ApiError"
import getStockApiInfo from "../api/getStockApiInfo"
import getStockInfoLastUpdated from "../api/getStockInfoLastUpdated"
import { StockQuoteData } from "../types/types"


type props = {
    symbol: string
    setErrorCode: (code: number | null) => void
}

export function useStockDetailsData({symbol, setErrorCode}: props){
    const [dataLoading, setLoading] = useState<boolean>(false)
    const [stockData, setStockData] = useState<StockQuoteData | null>(null)
    const [stockDataLastUpdated, setStockDataLastUpdated] = useState<string | null>(null)

    const fetchStocksData = useCallback(async () => {
        try{
            setLoading(true)
            const [data, lastUpdated] = await Promise.all([
                await getStockApiInfo({symbol: symbol}),
                await getStockInfoLastUpdated(symbol)
            ])
            setStockData(data)
            setStockDataLastUpdated(lastUpdated)
        }
        catch(err){
            if (err instanceof ApiError) setErrorCode(err.code)
            else setErrorCode(-1)
        }
        finally{
            setLoading(false)
        }
    }, [symbol])


    return { dataLoading, stockData, stockDataLastUpdated, fetchStocksData }
}