import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Portfolio.css";
import Loading from '../Loading/Loading';
import { useAuth } from "../../auth/AuthContext";
import QuickStats from "./PortfolioComponents/QuickStats";
import StocksTable from "./PortfolioComponents/StocksTable";
import getPortfolio from "../../functions/GetPortfolio";
import handleAxiosError from "../../functions/handleAxiosError";
import updateAllStocksInPortfolio from "../../functions/UpdateStocksInPortfolio";
import getHistory from "../../functions/getHistory";
import { FocusTrap } from 'focus-trap-react';
import Error from "../../error/Error";

// Learnt how important it is to make my application modular from the beginning
// and will be keeping this im mind while working on the ewst of this project
const Portfolio = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [ToDelete, setToDelete] = useState<{stock: number | null, name: string | null, logo: string | null}>({stock: null, name: null, logo: null});
  const [ModalVisible, setModalVisibility] = useState(false);
  const [FilteredOption, setFilteredOption] = useState("");
  const [JumpTo, setJumpTo] = useState("Top");
  const [FilterHistory, setFilterHistory] = useState("all")
  const [StockHistory, setStockHistory] = useState<any | null>(null)
  const [originalValues, setOriginalValues] = useState<any | null>(null)
  const [FilteredSearch, setFilteredSearch] = useState<any | null>([])
  const [displayError, setDisplayError] = useState<{display: boolean, warning: boolean, title: string, bodyText: string, buttonText: string}>({display: false, title: "", bodyText: "", warning: false, buttonText: ""});
  
  function handleDelete(index: number, stock: any, name: string, logo: string){
    setToDelete({stock: stock.id, name: name, logo: logo})
    console.log("Deleting Stock: " + stock)
    setModalVisibility(true);
  }

  const handleTrueDelete = async () => {
    if(ToDelete.name == null || ToDelete.logo == null){
      return
    }

    try {
      const response = await axios.delete(`https://tradingsim-backend.onrender.com/api/portfolio/${user?.id}/stocks/delete/${ToDelete.stock}`)
      console.log("Successfully Deleted: ", response)
      setToDelete({stock: null, name: null, logo: null})
      setModalVisibility(false)
    } catch (error) {
      handleAxiosError(error)
    }
  }

  useEffect(() => {
    if(user?.id){
      const updateAndFetch = async () => {
        const updateResponse = await updateAllStocksInPortfolio({ user })
        const id = user?.id
        updateResponse ? console.log("Stocks Updated") : console.log("Update Failed")
        const [portfolioResult, historyResult] = await Promise.all([
          getPortfolio({user: user, setDisplayError: setDisplayError}),
          getHistory({ id, FilterHistory})
        ])
        setPortfolio(portfolioResult);
        setStockHistory(historyResult)
        setOriginalValues({Invested: portfolioResult.totalInvested, PortfolioValue: portfolioResult.currentValue, Profit: portfolioResult.profitLoss})
      }

      updateAndFetch()
    }
  }, [user, FilterHistory, ToDelete])

  useEffect(() => { // Filter for Portfolio Table
    if (FilteredOption !== "") {
      let combined = portfolio.stocks.map((stock: any, index: number) => ({
        stock: stock,
      }));

      if (FilteredOption === "Oldest") {
        combined.sort((a: { stock: { id: number; }; }, b: { stock: { id: number; }; }) => Number(a.stock.id) - Number(b.stock.id));
      } else if (FilteredOption === "Newest") {
        combined.sort((a: { stock: { id: number; }; }, b: { stock: { id: number; }; }) => Number(b.stock.id) - Number(a.stock.id));
      } else if (FilteredOption === "ProfitAsc") {
        combined.sort((a: { stock: { profitLoss: number; }; }, b: { stock: { profitLoss: number; }; }) => Number(a.stock.profitLoss) - Number(b.stock.profitLoss));
      } else if (FilteredOption === "ProfitDesc") {
        combined.sort((a: { stock: { profitLoss: number; }; }, b: { stock: { profitLoss: number; }; }) => Number(b.stock.profitLoss) - Number(a.stock.profitLoss));
      } else if (FilteredOption === "ValueAsc") {
        combined.sort((a: { stock: { totalValue: number; }; }, b: { stock: { totalValue: number; }; }) => Number(a.stock.totalValue) - Number(b.stock.totalValue));
      } else if (FilteredOption === "ValueDesc") {
        combined.sort((a: { stock: { totalValue: number; }; }, b: { stock: { totalValue: number; }; }) => Number(b.stock.totalValue) - Number(a.stock.totalValue));
      }
  
      const sortedStocks = combined.map((item: { stock: any; }) => item.stock);
  
      setPortfolio((prevPortfolio: any) => ({
        ...prevPortfolio,
        stocks: sortedStocks
      }));
    }
  }, [FilteredOption]);
    
  function scrollToSection(JumpTo: string) {
    const element = document.getElementById(JumpTo);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  //-------------------------------------------------------------------------------
  // HTML SECTION BELOW
  //-------------------------------------------------------------------------------
  return (
    <>
      {portfolio ? (
        <>
          <section className="PortfolioPageHeader">
            <article className="PortfolioPageTitle">
              
              <h2 className="PageTitle">{user != null ? user.username + "'s" : "My"} Portfolio</h2>
              <div className="LineOne"></div>
            </article>
            <article className="PortfolioSummary">
              <div>
                <h4>Invested</h4>
                <h5>£{portfolio.totalInvested.toFixed(2)}</h5>
              </div>
              <div className="PortfolioSummaryCenter">
                <h3>Portfolio Value</h3>
                <h4>£{portfolio.currentValue.toFixed(2)}</h4>
              </div>
              <div>
                <h4>Profit</h4>
                <h5>{portfolio.profitLoss != null && portfolio.profitLoss >= 0 ? "+" : "-"}£{portfolio.profitLoss != null ? Math.abs(portfolio.profitLoss.toFixed(2)) : ""}
                </h5>
                <div>
                  <span style={portfolio.profitLoss != null && portfolio.profitLoss >= 0 ? {color: '#45a049'} : {color: '#bb1515'}}>
                    {portfolio.profitLoss != null && portfolio.profitLoss >= 0 ? "+" : ""}{(portfolio.currentValue && portfolio.totalInvested) ? (((portfolio.currentValue/portfolio.totalInvested)*100-100).toFixed(2)) : ""}{(portfolio.currentValue != null && portfolio.totalInvested != null) ? "%" : ""}
                  </span>
                </div>
              </div>
            </article>
          </section>

          <QuickStats 
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            History={StockHistory} 
            FilterHistory={FilterHistory} 
            setFilterHistory={setFilterHistory}
            FilteredSearch={FilteredSearch}
            originalValues={originalValues}
            />

          <div id="Space"></div>
          <div id="Space"></div>
          <div id="ToJump"></div>

          <StocksTable 
            setFilteredOption={setFilteredOption} 
            portfolio={portfolio} 
            ModalVisible={ModalVisible} 
            handleDelete={handleDelete} 
            setModalVisibility={setModalVisibility} 
            setToDelete={setToDelete}
            ToDelete={ToDelete}
            handleTrueDelete={handleTrueDelete}
            FilteredSearch={FilteredSearch}
            setFilteredSearch={setFilteredSearch}
            otherUser={false}
            />


          <a onClick={() => {setJumpTo(JumpTo == "#ToJump" ? "#Top" : "#ToJump"); JumpTo == "#ToJump" ? scrollToSection("Top") : scrollToSection("ToJump");}}><button aria-label="Jump Down to the stock table" className="ViewMore">          
            <div className={`ArrowOne ${JumpTo == "#ToJump" ? "Top" : ""}`} ></div>
            <div className={`ArrowTwo ${JumpTo == "#ToJump" ? "Top" : ""}`} ></div></button>
          </a>

          {/* <div style={{width: "90vw", marginTop: "4rem"}} className="LineOne"></div>
          <h2 className="PageTitle">Transaction History</h2>
          <div style={{width: "50vw"}} className="LineOne"></div>
          <div id="Space"></div> */}
          {displayError.display && 
            <FocusTrap>
              <div className="ToBuyModal" aria-labelledby="BuyStockTile" role='dialog' aria-modal="true">
                <Error setDisplayError={setDisplayError} warning={displayError.warning} title={displayError.title} bodyText={displayError.bodyText} buttonText={displayError.buttonText}/>
              </div>
            </FocusTrap>}

        </>
      ) : (
        <>
          <Loading/>
        </>
      )}
    </>
  );
};

export default Portfolio;

