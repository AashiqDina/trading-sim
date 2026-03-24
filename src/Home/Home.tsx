import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../Functions/AuthContext';
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FocusTrap } from 'focus-trap-react';
import Error from '../Error/Error';
import getStockPrice from '../Functions/getStockPrice';
import getTrendingStocks from '../Functions/getTrendingStocks';
import Loading from '../Loading/Loading';
import getMarketNews from '../Functions/getMarketNews';
import GetStockList from '../Functions/getStockList';
import HomeSearch from './HomeComponents/HomeSearch';
import HomeTrending from './HomeComponents/HomeTrending';
import { marketNews, stockList, trendingStocksList, HomeData, DisplayError } from '../types'; 
import HomeNews from './HomeComponents/HomeNews';


const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<HomeData>({stockList: null, marketNews: [], trendingList: []});
  const [isLoading, setIsLoading] = useState(true)
  const [displayError, setDisplayError] = useState<DisplayError>({
    display: false,
    title: "",
    bodyText: "",
    warning: false,
    buttonText: ""});


  useEffect(() => {
    let mounted = true
    const getData = async () => {
      try{
        const [StockList, MarketNews, TrendingList] = await Promise.all([
          GetStockList({setDisplayError: setDisplayError}),
          getMarketNews({setDisplayError: setDisplayError}),
          getTrendingStocks({setDisplayError: setDisplayError})
        ])

        if(!mounted) return
        setData({stockList: StockList, marketNews: MarketNews, trendingList: TrendingList})
      }
      finally{
        if(mounted) setIsLoading(false)
      }
    }
    getData()
    return () => { mounted = false}
  }, [])

  const searchStock = useCallback(async (symbol: string) => {
          
    var stockPrice = await getStockPrice({symbol: symbol, setDisplayError: setDisplayError})
      
    if(stockPrice){
      navigate(`/stock/${encodeURIComponent(String(symbol ?? ''))}`)
    }
  }, [navigate, setDisplayError]);

  if(isLoading) return (          
    <section className='CompleteTrendingBody'>
      <article className='TrendingStocksSection'>
        <Loading/>
      </article>
    </section> )

  return (
    <>
      <HomeSearch 
        stockList={data?.stockList ?? null}
        searchStock={searchStock}
      />

      <section className='MotherBody'>
        <HomeTrending
          stockList={data?.stockList ?? null}
          trendingStocksList={data?.trendingList}
          searchStock={searchStock}
        />
      </section>

      <HomeNews
        marketNews={data?.marketNews}
      />
      
        {displayError.display && 
        <FocusTrap>
          <div className="ToBuyModal" aria-labelledby="BuyStockTile" role='dialog' aria-modal="true">
            <Error setDisplayError={setDisplayError} warning={displayError.warning} title={displayError.title} bodyText={displayError.bodyText} buttonText={displayError.buttonText}/>
          </div>
        </FocusTrap>}
    </>
  );
};

export default Home;
