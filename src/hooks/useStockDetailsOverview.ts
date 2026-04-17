import { useCallback, useState } from "react";
import { StockDetailsHistoryItem } from "../types/types";
import getStockHistory from "../api/getStockHistory";
import { ApiError } from "../error/ApiError";

type  props = {
    symbol: string | undefined
    setErrorCode: (code: number | null) => void
}

export function useStockDetailsOverview({ symbol, setErrorCode }: props){
    const [fullHistory, setFullHistory] = useState<StockDetailsHistoryItem[]>([])
    const [history, setHistory] = useState<StockDetailsHistoryItem[]>([])
    const [overviewLoading, setOverviewLoading] = useState(false)

    const getHistory = useCallback(async () => {
        try{
            if(symbol === undefined) throw new ApiError(-1)
            setOverviewLoading(true)
            let result = await getStockHistory(symbol)
            let reversedResult = [...result].reverse()
            setFullHistory(reversedResult)
            setHistory(reversedResult)
        }
        catch(error){
            if (error instanceof ApiError) setErrorCode(error.code)
            else setErrorCode(-1)
        }
        finally{
            setOverviewLoading(false)
        }
    }, [symbol])

    const ranges: Record<string, number> = {
        threeYears: 3 * 365,
        year: 365,
        threeMonths: 90,
        month: 30,
        week: 7,
    };

    const filterHistory = (range: keyof typeof ranges | "all") => {
        if (range === "all") {
            setHistory(fullHistory);
            return;
        }

        const days = ranges[range];
        const now = Date.now();

        const filtered = fullHistory.filter(item =>
            item.datetime && now - new Date(item.datetime).getTime() <= days * 24 * 60 * 60 * 1000
        );

        setHistory(filtered);
    };

    return { history, overviewLoading, getHistory, filterHistory }
}