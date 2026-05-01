import { useCallback, useState } from "react"
import getStockApiInfo from "../../api/getStockApiInfo"
import getStockInfoLastUpdated from "../../api/getStockInfoLastUpdated"
import { StockQuoteData } from "../../types/types"


type props = {
    symbol: string
    handleError: (err: unknown) => void
}

export function useStockDetailsData({symbol, handleError}: props){
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
            handleError(err)
        }
        finally{
            setLoading(false)
        }
    }, [symbol, handleError])


    return { dataLoading, stockData, stockDataLastUpdated, fetchStocksData }
}