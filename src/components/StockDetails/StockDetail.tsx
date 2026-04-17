import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './StockDetail.css';
import { StockApiInfo, CompanyProfile } from "../../interfaces/interfaces";
import { useAuth } from "../../auth/AuthContext";
import CompanyInformation from './StockDetailsComponents/StockDetailsCompanyInformation'
import StockDetails from './StockDetailsComponents/StockDetailsStockData'
import StockDetailsOwnedStocks from './StockDetailsComponents/StockDetailsOwnedStocks';
import StockDetailsNews from './StockDetailsComponents/StockDetailsNews';
import { FocusTrap } from 'focus-trap-react';
import Confetti from 'react-confetti';
import StockDetailsOverview from './StockDetailsComponents/StockDetailsOverview';
import Error from '../../error/Error';
import { useStockDetails } from '../../hooks/useStockDetails';
import { useStockDetailsNews } from '../../hooks/useStockDetailsNews';
import { useStockDetailsOwnedStocks } from '../../hooks/useStockDetailsOwnedStocks';
import { useStockDetailsData } from '../../hooks/useStockDetailsData';
import { useStockDetailsInfo } from '../../hooks/useStockDetailsInfo';
import ErrorPopup from '../../error/ErrorPopup';
import { useStockDetailsOverview } from '../../hooks/useStockDetailsOverview';

type DisplayedDataType = "Overview" | "CompanyInformation" | "StockData" | "OwnedStocks" | "News";


const StockDetail: React.FC = () => {

  const { user } = useAuth();
  const { symbol } = useParams();
  const { state } = useLocation()
  const stockSymbol = decodeURIComponent(symbol ?? '');


  const [DisplayedData, setDisplayedData] = useState<DisplayedDataType>("Overview")
  const [quantity, setQuantity] = useState<string>("0");
  const [cost, setCost] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null)



  const [displayError, setDisplayError] = useState<{display: boolean, warning: boolean, title: string, bodyText: string, buttonText: string}>({display: false, title: "", bodyText: "", warning: false, buttonText: ""});
  
  const { stockName, stockLogo, showConfetti, buyModalOpen, handlebuyStock, changeBuyModal } = useStockDetails({userId: user?.id, stockSymbol: stockSymbol, setErrorCode: setErrorCode})
  const { newsLoading, marketNews, fetchStockNews} = useStockDetailsNews({symbol: stockSymbol, setErrorCode: setErrorCode})
  const { ownedStocksLoading, ownedStocks, lastUpdated, fetchOwnedStocks} = useStockDetailsOwnedStocks({symbol: stockSymbol, user: user?.id, setErrorCode: setErrorCode})
  const { dataLoading, stockData, stockDataLastUpdated, fetchStocksData } = useStockDetailsData({symbol: stockSymbol, setErrorCode: setErrorCode})
  const { infoLoading, companyInformation, fetchStocksInfo } = useStockDetailsInfo({symbol: stockSymbol, setErrorCode: setErrorCode})
  const { overviewLoading, history, getHistory, filterHistory } = useStockDetailsOverview({symbol: stockSymbol, setErrorCode: setErrorCode})




  const componentObj = {
    Overview: (
      <StockDetailsOverview
        overviewLoading={overviewLoading}
        history={history}
        getHistory={getHistory}
        filterHistory={filterHistory}
      />
    ),
    CompanyInformation: (
      <CompanyInformation
        infoLoading={infoLoading}
        companyInformation={companyInformation}
        fetchStocksInfo={fetchStocksInfo}
        symbol={stockSymbol}
      />
    ),
    StockData: (
      <StockDetails
        dataLoading={dataLoading}
        stockData={stockData}
        stockDataLastUpdated={stockDataLastUpdated}
        fetchStocksData={fetchStocksData}
        stockPrice={state?.stockPrice}
      />
    ),
    OwnedStocks: (
      <StockDetailsOwnedStocks 
        ownedStocks={ownedStocks}
        fetchOwnedStocks={fetchOwnedStocks}
        lastUpdated={lastUpdated}
        loading={ownedStocksLoading}
      />
    ),
    News: (
      <StockDetailsNews 
        marketNews={marketNews}
        fetchStockNews={fetchStockNews}
        loading={newsLoading}
      />
    ),
  };

  function SwitchSection(Section: string){
    switch(Section){
      case "Overview":
        setDisplayedData("Overview")
        break
      case "CompanyInformation":
        setDisplayedData("CompanyInformation")
        break
      case "StockData":
        setDisplayedData("StockData")
        break
      case "OwnedStocks":
        setDisplayedData("OwnedStocks")
        break
      case "News":
        setDisplayedData("News")
        break
      default:
        setDisplayedData("Overview")
        break
    }
  }

  return (
    <>
      {showConfetti && 
        <Confetti
          numberOfPieces={(Number(quantity) * 20) > 1000 ? 999 : (Number(quantity) * 20)}
          recycle={false}
        />
        }
        <header className='TitleBox'>
          <section className='TitleSec'>
            <img className='TitleLogo' src={stockLogo} alt={`Logo`} />
              <article className='StockDetailsPrice'>
                <div className='MiniNameSymbolSection'>
                  <h1 className='StockDetailsTitle'>{stockName}<span className='StockSymbol'>{stockSymbol}</span></h1>
                </div>
                <h2 style={stockName && stockName.length > 18 ? {marginTop: "0.5rem"} : undefined}>£{typeof state?.stockPrice === "number" ? state?.stockPrice?.toFixed(2) : "..."}</h2>
              </article>
          </section>
          <section className='CompleteSelector'>
            <section className='SectionSection'>
              <article className='Selector'>
                {user && <button className='BuyStockButton' aria-label='Buy Stock' onClick={changeBuyModal}>Buy Stock</button>}
                <button aria-pressed={DisplayedData === "Overview"} aria-label="View overview" onClick={() => SwitchSection("Overview")} className={"Overview" + (DisplayedData == "Overview" ? "Selected" : "")}>Overview</button>
                <button aria-pressed={DisplayedData === "CompanyInformation"} aria-label="View company information" onClick={() => SwitchSection("CompanyInformation")} className={"CompanyInformation" + (DisplayedData == "CompanyInformation" ? "Selected" : "")}>About</button>
                <button aria-pressed={DisplayedData === "StockData"} aria-label="View stock data" onClick={() => SwitchSection("StockData")} className={"StockData" + (DisplayedData == "StockData" ? "Selected" : "")}>Stock Data</button>
                {user && <button aria-pressed={DisplayedData === "OwnedStocks"} aria-label="View owned stocks" onClick={() => SwitchSection("OwnedStocks")} className={"OwnedStocks" + (DisplayedData == "OwnedStocks" ? "Selected" : "")}>Owned Stocks</button>}
                <button aria-pressed={DisplayedData === "News"} aria-label="View stock related news" onClick={() => SwitchSection("News")} className={"News" + (DisplayedData == "News" ? "Selected" : "")}>News</button>
              </article>
            </section>
          </section>
        </header>

        <section className='MainBody'>
            <div className='StockDetails'>
              {componentObj[DisplayedData] ?? null}    
            </div>
        </section>
        {buyModalOpen && (
            <FocusTrap>
              <div className="ToBuyModal" aria-labelledby="BuyStockTile" role='dialog' aria-modal="true">
                <div className="ToBuyContent">
                  <header>
                    <div className='BuyStockTitle'>
                      <h2>Purchase {stockName} <span className='StockSymbol'>{stockSymbol}</span></h2>
                    </div>
                    <div className='BuyStockLogo'>
                      <img className='StockLogo' style={{margin: "0"}} src={stockLogo} alt="Logo" />
                    </div>
                  </header>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    console.log("called")
                    handlebuyStock(state?.stockPrice, quantity);
                    }}>
                    <div className='toBuyBody'>
                      <label htmlFor="quantity">Number of Shares:</label>
                      <input                         
                          aria-label="Enter the quantity here (or leave it blank if you wish to spend a specific amount)"
                          id="quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => {setQuantity(e.target.value); setCost((Number(e.target.value)*(state?.stockPrice || 0)).toFixed(2))}}
                          className="QuantityInput"
                          onBlur={() => {
                            if (quantity === "" || Number(quantity) < 1) {
                              setQuantity("0")
                            }
                            if (cost) setCost(Number(cost).toFixed(2));
                            if (quantity) setQuantity(Number(quantity).toFixed(2));
                          }}/>
                      <label htmlFor="cost">Estimated Cost:</label>
                      <input                         
                          aria-label="Enter the Price here (or leave it blank if you wish to buy a specific amount of stocks)"
                          id="cost"
                          type="number"
                          value={(cost || String(Number(quantity)*(state?.stockPrice || 0)))}
                          onChange={(e) => {
                            let q = (Number(e.target.value)/(state?.stockPrice || 0))
                            setQuantity(q.toFixed(2)); 
                            setCost((Number(q)*(state?.stockPrice || 0)).toFixed(2))}}
                          className="QuantityInput"
                          onBlur={() => {
                            if (cost) setCost(Number(cost).toFixed(2));
                            if (quantity) setQuantity(Number(quantity).toFixed(2));
                          }}
                          /> 
                    </div>
                    <footer className="ToBuyFooter">
                        <button type='button' onClick={changeBuyModal}>Cancel</button>
                        <button type='submit'>Confirm Purchase</button>
                    </footer>
                  </form>
                </div>
              </div>
            </FocusTrap>
          )}    

        {errorCode &&
          <FocusTrap>
              <ErrorPopup 
                ErrorCode={errorCode}
                Confirm={() => {setErrorCode(null)}}
                />
          </FocusTrap>
        }

        {displayError.display && 
        <FocusTrap>
          <div className="ToBuyModal" aria-labelledby="BuyStockTile" role='dialog' aria-modal="true">
            <Error setDisplayError={setDisplayError} warning={displayError.warning} title={displayError.title} bodyText={displayError.bodyText} buttonText={displayError.buttonText}/>
          </div>
        </FocusTrap>}
    </>
  );
};

export default StockDetail;
