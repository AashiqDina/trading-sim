import { useCallback, useState } from "react"
import { MarketNews } from "../types/types"
import getStockNews from "../api/getStockNews"

type props = {
    symbol: string
    handleError: (err: unknown) => void
}

export function useStockDetailsNews({symbol, handleError}: props){
    const [newsLoading, setLoading] = useState<boolean>(false)
    const [marketNews, setMarketNews] = useState<MarketNews[]>([])

    const fetchStockNews = useCallback(async () => {
        try{
            setLoading(true)
            let response = await getStockNews({symbol: symbol});
            setMarketNews(response)
        }
        catch(err){
            handleError(err)
        }
        finally{
            setLoading(false)
        }
    }, [symbol])

    return { newsLoading, marketNews, fetchStockNews,}
}