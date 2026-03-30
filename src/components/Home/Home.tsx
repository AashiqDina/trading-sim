import "./Home.css";
import { FocusTrap } from 'focus-trap-react';
import ErrorPopup from '../../error/ErrorPopup';
import Loading from '../Loading/Loading';
import HomeSearch from './HomeComponents/HomeSearch';
import HomeTrending from './HomeComponents/HomeTrending';
import HomeNews from './HomeComponents/HomeNews';
import { useHomeData } from '../../hooks/useHomeData'

const Home: React.FC = () => {
  const { data, isLoading, ErrorCode, searchStock, clearErrCode } = useHomeData()

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
              Confirm={() => {clearErrCode()}}
              />
          </div>
        </FocusTrap>}
    </>
  );
};

export default Home;

