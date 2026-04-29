import { useEffect } from 'react';
import formatNumber from '../../../utils/FormatNumber';
import Loading from '../../Loading/Loading';
import { useStockDetailsData } from '../../../hooks/stockDetails/useStockDetailsData';

type Props = {
    symbol: string
    stockPrice: number
    handleError: (err: unknown) => void
}

export default function StockDetails({ symbol, handleError, stockPrice }: Props){

  const { dataLoading, stockData, stockDataLastUpdated, fetchStocksData } = useStockDetailsData({symbol: symbol, handleError: handleError})

  useEffect(() => {
    fetchStocksData()
  }, [fetchStocksData])

  if(dataLoading) return <Loading scale={0.8}/>

  if(!stockData) return (
    <div>
      <h2>Stock data not available</h2>
    </div>
  )

    return (
        <section className='StockData'>
          <article className={stockData?.isMarketOpen ? "OpenMarketArticle" : "CloseMarketArticle"} tabIndex={0}>
            {stockData?.isMarketOpen ? 
              <img src={process.env.PUBLIC_URL + "/Sun.svg"} alt="Market Open" /> : 
              <img src={process.env.PUBLIC_URL + "/Moon.svg"} alt="Market Close" />}
              <h2>{stockData?.isMarketOpen ? "Market Open" : "Market Closed"}</h2>
          </article>
          <article>
            <p className='stockInfoLastUpdated'> Last Updated: {stockDataLastUpdated ? new Date(stockDataLastUpdated).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
            : "N/A"}</p>
          </article>
          <article className='StockDataMain'>
            <div className='StockDataMainLeft' tabIndex={0}>
              <div className='StockDailyRange' style={{width: "100%"}}>
                <h4 style={{textAlign: 'left', padding: "0 0 0 10%" }}>Daily Range</h4>
                  <div style={{width: "100%"}}>
                    <div className='LineOne' style={{width: "80%"}}>
                      <div className='StockDailyAveragePoint'>
                        <span style={stockData?.low && stockData?.high ? {left: `${((stockPrice-stockData.low)/(stockData.high-stockData.low))*100}%`} : {}}>
                        </span>
                        </div>
                    </div>
                  </div>
                  <div className='lhTitles'>
                    <p>£{stockData?.low?.toFixed(2)}</p>
                    <p>£{stockData?.high?.toFixed(2)}</p>
                  </div>
              </div>
              <div className='StockDailyRange' style={{width: "100%"}}>
                <h4 style={{textAlign: 'left', padding: "0 0 0 10%", marginTop: "0.4rem" }}>52-Week Range</h4>
                <div style={{width: "100%"}}>
                  <div className='LineOne' style={{width: "80%"}}>
                    <div className='StockDailyAveragePoint'>
                      <span style={stockData?.fiftyTwoWeek.range ? {left: `${((stockPrice-Number(stockData?.fiftyTwoWeek.range?.split(" ")[0]))/(Number(stockData?.fiftyTwoWeek.range?.split(" ")[2])-Number(stockData?.fiftyTwoWeek.range?.split(" ")[0])))*100}%`} : {}}>
                      </span>
                      </div>
                  </div>
                </div>
                <div className='lhTitles'>
                  <p>£{Number(stockData?.fiftyTwoWeek.range?.split(" ")[0]).toFixed(2)}</p>
                  <p>£{Number(stockData?.fiftyTwoWeek.range?.split(" ")[2]).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className='StockDataMainRight' tabIndex={0}>
              <div className='genericFlexRow' style={{margin: "0 1rem 0 1rem"}}>

                <h4>Volume:</h4>
                <div className='VolumeContainer'>
                  <div className='VolumeFill' style={{width: (stockData?.volume/stockData?.averageVolume) > 1 ? "100%" : `${((stockData?.volume/stockData?.averageVolume)*100)}%`, backgroundColor: (stockData?.volume/stockData?.averageVolume) < 0.5 ? "#ffffffff" : (stockData?.volume/stockData?.averageVolume) >= 1 ? "#45a049" : "#486c4aff" }}>
                  </div>
                </div>
                <h5 className='VolumeGFR'><span style={{fontWeight: 400}}>{formatNumber(Number(stockData?.volume))}</span></h5>
                /
                <h5 className='VolumeGFR'><span style={{fontWeight: 400}}>{formatNumber(Number(stockData?.averageVolume))}</span></h5>
              </div>
              <div className='genericFlexRow' style={{margin: "0 1rem 0 1rem", justifyContent: "flex-start"}}>
                <h4>Open:</h4>
                <h5 className='StockDataOpen'>£{stockData ? stockData?.open.toFixed(2) : "error"}</h5>
              </div>
              <div className='genericFlexRow' style={{margin: "0 1rem 0 1rem", justifyContent: "flex-start"}}>
                <div className='ClosePrevClose'>
                  <h4>Close:</h4>
                  <h5>£{stockData ? stockData.close.toFixed(2) : "error"}</h5>
                </div>
                <div className='ClosePrevClose'>
                  <h4>Previous Close:</h4>
                  <h5>£{stockData ? stockData?.previousClose.toFixed(2) : "error"}</h5>
                </div>
                <div className='ClosePrevClose' style={{gap: "0.4rem", color: stockData?.change > 0 ? "#45a049" : "rgb(187, 21, 21)"}}>
                  <h6>{stockData?.percentChange > 0 ? "+" : undefined}{stockData ? (stockData?.percentChange).toFixed(2) : undefined}%</h6>
                </div>

              </div>
            </div>
          </article>
        </section>
    )

}

