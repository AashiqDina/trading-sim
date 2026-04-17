import { useCallback, useState } from "react"
import { MarketNews } from "../types/types"
import { ApiError } from "../error/ApiError"
import getStockNews from "../api/getStockNews"

type props = {
    symbol: string
    setErrorCode: (code: number | null) => void
}

export function useStockDetailsNews({symbol, setErrorCode}: props){
    const [newsLoading, setLoading] = useState<boolean>(false)
    const [marketNews, setMarketNews] = useState<MarketNews[]>([])

    const fetchStockNews = useCallback(async () => {
        try{
            setLoading(true)
            let response = await getStockNews({symbol: symbol});
            setMarketNews(response)
        }
        catch(err){
            if (err instanceof ApiError) setErrorCode(err.code)
            else setErrorCode(-1)
        }
        finally{
            setLoading(false)
        }
    }, [symbol])

    return { newsLoading, marketNews, fetchStockNews,}
}