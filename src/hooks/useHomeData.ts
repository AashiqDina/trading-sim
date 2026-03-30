import { useState, useEffect, useCallback } from 'react';
import GetStockList from '../api/getStockList';
import getMarketNews from '../api/getMarketNews';
import getTrendingStocks from '../api/getTrendingStocks';
import { HomeData } from '../types/types';
import { useNavigate } from 'react-router-dom';
import getStockPrice from '../api/getStockPrice';
import { ApiError } from '../error/ApiError';

export function useHomeData() {
    const navigate = useNavigate();
    const [data, setData] = useState<HomeData>({
        stockList: null,
        marketNews: [],
        trendingList: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [ErrorCode, setErrorCode] = useState<number | null>(null);

    const clearErrCode = () => {
        setErrorCode(null)
    }

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

    const searchStock = useCallback(async (symbol: string) => {
        try{
          const stockPrice = await getStockPrice(symbol)
          if(stockPrice) navigate(`/stock/${encodeURIComponent(String(symbol ?? ''))}`)
        }
        catch (err) {
          if (err instanceof ApiError) {
            setErrorCode(err.code);
          } else {
            setErrorCode(-1);
          }
        }
      }, [navigate]);

  return { data, isLoading, ErrorCode, searchStock, clearErrCode };
}