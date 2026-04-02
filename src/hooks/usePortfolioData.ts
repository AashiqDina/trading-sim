import { useEffect, useState } from "react";
import getHistory from "../api/getHistory";
import getPortfolio from "../api/getPortfolio";
import { ApiError } from "../error/ApiError";
import updateAllStocksInPortfolio from "../functions/UpdateStocksInPortfolio";
import { UserPortfolio, StockHistoryItem } from "../types/types";
import getAllStocksLastUpdated from "../api/getAllStocksLastUpdated";

type Props = {
  userId?: number | null;
}

export function usePortfolioData({ userId }: Props) {
    const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
    const [fullHistory, setFullHistory] = useState<StockHistoryItem[] | null>(null);
    const [LastUpdatedDictionary, setLastUpdatedDictionary] = useState<Map<string, Date> | null>(null)
    const [loading, setLoading] = useState(true);
    const [dataErrorCode, setErrorCode] = useState<number | null>(null)

    const resetDatasError = () => {
        setErrorCode(null);
    };

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                await updateAllStocksInPortfolio({ user: { id: userId } });

                const [portfolioResult, historyResult, LastUpdatedResult] = await Promise.all([
                    getPortfolio(userId),
                    getHistory({ id: userId, filterHistory: "all" }),
                    getAllStocksLastUpdated(),
                ]);

                console.log(portfolioResult)
                setPortfolio(portfolioResult);
                setFullHistory(historyResult || []);
                const map = new Map<string, Date>(Object.entries(LastUpdatedResult.data).map(([key, value]) => [key, new Date(value as string)]));
                setLastUpdatedDictionary(map);
            }
            catch(err){
                if(err instanceof ApiError){
                    setErrorCode(err.code)
                }
                else setErrorCode(-1)
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const refreshPortfolio = async () => {
        if (!userId) return;

        setLoading(true);

        try {
            const [portfolioResult, historyResult] = await Promise.all([
            getPortfolio(userId),
            getHistory({ id: userId, filterHistory: "all" }),
            ]);

            setPortfolio(portfolioResult);
            setFullHistory(historyResult || []);
        } finally {
            setLoading(false);
        }
        };

    return { portfolio, fullHistory, loading, dataErrorCode, resetDatasError, refreshPortfolio, LastUpdatedDictionary};
}