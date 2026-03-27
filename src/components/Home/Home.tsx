import React, { useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FocusTrap } from 'focus-trap-react';
import ErrorPopup from '../../error/ErrorPopup';
import getStockPrice from '../../api/getStockPrice';
import Loading from '../Loading/Loading';
import HomeSearch from './HomeComponents/HomeSearch';
import HomeTrending from './HomeComponents/HomeTrending';
import HomeNews from './HomeComponents/HomeNews';
import { useHomeData } from '../../hooks/useHomeData'
import { ApiError } from '../../error/ApiError';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, ErrorCode, setErrorCode } = useHomeData()

  const searchStock = useCallback(async (symbol: string) => {
    try{
      var stockPrice = await getStockPrice(symbol)
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
      
        {ErrorCode &&
        <FocusTrap>
          <div className="ToBuyModal" aria-labelledby="BuyStockTile" role='dialog' aria-modal="true">
            <ErrorPopup 
              ErrorCode={ErrorCode}
              Confirm={() => {setErrorCode(null)}}
              />
          </div>
        </FocusTrap>}
    </>
  );
};

export default Home;

