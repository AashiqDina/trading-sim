import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../Functions/AuthContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FocusTrap } from 'focus-trap-react';
import Error from '../Error/Error';
import getStockPrice from '../Functions/getStockPrice';
import getTrendingStocks from '../Functions/getTrendingStocks';
import Loading from '../Loading/Loading';
import getMarketNews from '../Functions/getMarketNews';
import SponsoredAd from '../Ads/SponsoredAd';
import GetStockList from '../Functions/getStockList';
import HomeSearch from './HomeComponents/HomeSearch';
import HomeTrending from './HomeComponents/HomeTrending';

type stockList = Record<string, {symbol: string, logo: string}> | null
type marketNews = {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
};
type trendingStocksList = string[] 


const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for stock search
  const [data, setData] = useState<{stockList: stockList, marketNews: marketNews[], trendingStocks: trendingStocksList}>({stockList: null, marketNews: [], trendingStocks: []});
  const [displayError, setDisplayError] = useState<{display: boolean, warning: boolean, title: string, bodyText: string, buttonText: string}>({display: false, title: "", bodyText: "", warning: false, buttonText: ""});
  const [marketNewsIndex, setMarketNewsIndex] = useState<{index: number, direction: string}>({index: 0, direction: "left"})
  const [WinWidth, setWinWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(true)
  const MarketNewsRef = useRef<(HTMLAnchorElement | null)[]>([]);


  useEffect(() => {
    const getData = async () => {
      const [StockList, MarketNews, TrendingList] = await Promise.all([
        GetStockList({setDisplayError: setDisplayError}),
        getMarketNews({setDisplayError: setDisplayError}),
        getTrendingStocks({setDisplayError: setDisplayError})
      ])
      setIsLoading(false)
      console.log(TrendingList)
      setData({stockList: StockList, marketNews: MarketNews, trendingStocks: TrendingList})
    }
    getData()
  }, [])

  useEffect(() => {
    MarketNewsRef.current.forEach((el) => {
    if(!el){
      return
    };
    if(marketNewsIndex.direction == "left"){
      el.classList.remove("newsAnimateLeft");
      void el.offsetWidth;
      el.classList.add("newsAnimateLeft");
    }
    else{
      el.classList.remove("newsAnimateRight");
      void el.offsetWidth;
      el.classList.add("newsAnimateRight");
    }
  });
  }, [marketNewsIndex])


  const searchStock = useCallback(async (symbol: string) => {
          
    var stockPrice = await getStockPrice({symbol: symbol, setDisplayError: setDisplayError})
      
    if(stockPrice != null){
      navigate(`/stock/${encodeURIComponent(String(symbol ?? ''))}`)
    }
  }, [navigate, setDisplayError]);

  function newsLeft(){
    marketNewsIndex.index == 0 ? setMarketNewsIndex({index: 97, direction: "left"}) : setMarketNewsIndex({index: marketNewsIndex.index-3, direction: "left"})

  }

  function newsRight(){
    marketNewsIndex.index >= 97 ? setMarketNewsIndex({index: 0, direction: "right"}) : setMarketNewsIndex({index: marketNewsIndex.index+3, direction: "right"})
  }

  return (
    <>
      <HomeSearch 
        stockList={data?.stockList ?? null}
        isLoading={isLoading}
        searchStock={searchStock}
      />

      <section className='MotherBody'>
        {isLoading ? 
          <section className='CompleteTrendingBody'>
            <article className='TrendingStocksSection'>
              <Loading/>
            </article>
          </section>
        : <HomeTrending
            stockList={data?.stockList ?? null}
            trendingStocksList={data?.trendingStocks}
            searchStock={searchStock}
        />}
      </section>
      <>
      {(data?.marketNews != null) ? 
      <section className='NewsTitleSection'>
          <section className='HomeNewsSectionTitle'>
            <article>
              <h2>Today's News</h2>
              <div className='newsArrowContainer'>
                <button className='newsArrowTriangleContainer' onClick={() => {newsLeft()}}>
                  <div className='newsLeftArrow'></div>
                </button>
                <button className='newsArrowTriangleContainer' onClick={() => {newsRight()}}>
                  <div className='newsRightArrow'></div>
                </button>
              </div>
            </article>
          </section>
      </section> : undefined}
      <section className='MotherBody2'>
          <article className='HomeNewsSection' style={((data?.marketNews == null && data?.trendingStocks.length != 0) || (data?.marketNews?.length == 0)) ? {justifyContent: 'center'} : undefined}>
            {false && <SponsoredAd></SponsoredAd>} {/* Doesnt work unless I have a domain, didnt know about that until after all of this*/}
            {
              (data?.marketNews == null && data?.trendingStocks.length != 0) ?
                <Loading top={8} height={46} marginBottom={-1}/>
              :
              (data?.marketNews && data?.marketNews.length == 0) ? <h3 className='NoNewsFoundHeading'>No News Found</h3> :
              (data?.marketNews != null) ? 
                data?.marketNews.slice(marketNewsIndex.index, marketNewsIndex.index + 3).map((news, index) => {
                  return (
                    <a href={news.url || "brokenURL"} aria-label={`Read news: ${news.headline || "brokenHeadline"}`} className='CompleteMarketNews' key={news.url || index} style={{animationDelay: `${index * 0.1}s`}} ref={(el) => {if (el) MarketNewsRef.current[index] = el;}}>
                      <div className='marketNewsImage'>
                        {WinWidth > 600 && <img src={news.image || "brokenSource"} alt={news.source + " image" || "brokenSource"} />}
                      </div>
                      <div className={WinWidth > 600 ? 'marketNewsContainer' : 'marketNewsContainerMobile'}>
                        <div className={WinWidth > 600 ? 'marketNewsHeader' : 'marketNewsHeaderMobile'}>
                          {WinWidth < 600 && <img className='newsImageInHeader' src={news.image || "brokenSource"} alt={news.source + " image"} />}
                          <h3>{news.headline || "brokenHeadline"}</h3>
                        </div>
                        <div className='marketNewsBody'>
                          <p>{news.summary || "brokenSummary"}</p>
                        </div>
                        <div className='marketNewsFooter'>
                          <p>Source: <span>{news.source || "brokenSource"}</span></p>
                          <p>{new Date(news.datetime * 1000 || "0000000").toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}</p>
                        </div>
                      </div>
                    </a>
                  )
                })
                : undefined
            }
          </article>
      </section>
      </>
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
