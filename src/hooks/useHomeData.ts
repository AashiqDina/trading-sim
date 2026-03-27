import { useState, useEffect } from 'react';
import GetStockList from '../api/getStockList';
import getMarketNews from '../api/getMarketNews';
import getTrendingStocks from '../api/getTrendingStocks';
import { HomeData } from '../types/types';

export function useHomeData() {
  const [data, setData] = useState<HomeData>({
    stockList: null,
    marketNews: [],
    trendingList: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [ErrorCode, setErrorCode] = useState<number | null>(null);

    useEffect(() => {
        let mounted = true
        const getData = async () => {
            try{
                const [StockList, MarketNews, TrendingList] = await Promise.all([
                    GetStockList(),
                    getMarketNews(),
                    getTrendingStocks()
                ])

                if(!mounted) return
                setData({stockList: StockList, marketNews: MarketNews, trendingList: TrendingList})
            }
            catch (err) {
                if (typeof err === "number") {
                    setErrorCode(err);
                } 
                else {
                    setErrorCode(-1);
                }
            }
            finally{
                if(mounted) setIsLoading(false)
            }
        }
        getData()
        return () => { mounted = false}
    }, [])

  return { data, isLoading, ErrorCode, setErrorCode };
}