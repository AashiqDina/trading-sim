import { useState } from "react";
import "./Portfolio.css";
import Loading from '../Loading/Loading';
import { useAuth } from "../../auth/AuthContext";
import QuickStats from "./PortfolioComponents/QuickStats";
import StocksTable from "./PortfolioComponents/StocksTable";
import { FocusTrap } from 'focus-trap-react';
import { Transaction } from "../../types/types";
import { usePortfolio } from "../../hooks/usePortfolio";
import ErrorPopup from "../../error/ErrorPopup";
import { useParams } from "react-router-dom";
import PortfolioHeader from "./PortfolioComponents/PortfolioHeader";
import DeletePortfolioStockModal from "./PortfolioComponents/DeletePortfolioStockModal";
import { usePortfolioViewData } from "../../hooks/usePortfolioViewData";

const Portfolio = () => {
  const { userId, username} = useParams();
  const { user } = useAuth();

  const trueUserId = userId && !isNaN(Number(userId)) ? Number(userId) : user?.id ?? null;
  const owner = trueUserId === user?.id;
  
  const [toDelete, setToDelete] = useState<Transaction | null>(null);
  const [modalVisible, setModalVisibility] = useState<boolean>(false);
  const [FilteredOption, setFilteredOption] = useState("");
  const [JumpTo, setJumpTo] = useState("Top");
  const [filterHistory, setFilterHistory] = useState<string>("all")
  const [searchInput, setSearchInput] = useState<string>("")
  const [hoverValues, setHoverValues] = useState<{
    invested: number
    value: number
    profit: number
  } | null>(null);

  const { portfolio, fullHistory, loading, errorCode, resetError, handleDeleteStock, refreshPortfolio, LastUpdatedDictionary } = usePortfolio({ userId: trueUserId })
  const { visibleStocks, tableStocks, history } = usePortfolioViewData({portfolio, searchInput, FilteredOption, fullHistory, filterHistory})


  function handleDelete(stock: Transaction){
    setToDelete(stock)
    setModalVisibility(true);
  }

  function cancelDelete(){
    setToDelete(null)
    setModalVisibility(false);
  }

  const handleTrueDelete = async () => {
    if (!toDelete || !user || !owner) return;

    const result = await handleDeleteStock(user.id, toDelete.id);
    if (!result) return;

    refreshPortfolio();
    setToDelete(null);
    setModalVisibility(false);
  };
    
  function scrollToSection(JumpTo: string) {
    const element = document.getElementById(JumpTo);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if(loading) return (<Loading/>)

  if(!portfolio) return (               
     <ErrorPopup 
        ErrorCode={errorCode ?? -1}
        Confirm={() => {resetError()}}
      />)

  return (
        <>
          <PortfolioHeader
            username={username || user?.username || "Unknown"} 
            totalInvested={hoverValues?.invested ?? portfolio.totalInvested} 
            currentValue={hoverValues?.value ?? portfolio.currentValue} 
            profitLoss={hoverValues?.profit ?? portfolio.profitLoss}          
          />

          <QuickStats 
            fullHistory={fullHistory}
            history={history} 
            filterHistory={filterHistory} 
            visibleStocks={visibleStocks}
            setFilterHistory={setFilterHistory}
            setHoverValues={setHoverValues}
          />

          <div id="Space"></div>
          <div id="Space"></div>
          <div id="ToJump"></div>

          <StocksTable 
            setFilteredOption={setFilteredOption} 
            handleDelete={handleDelete} 
            setSearchInput={setSearchInput}
            owner={owner}
            tableStocks={tableStocks}
            LastUpdatedDictionary={LastUpdatedDictionary}
          />

          <a onClick={() => {setJumpTo(JumpTo == "#ToJump" ? "#Top" : "#ToJump"); JumpTo == "#ToJump" ? scrollToSection("Top") : scrollToSection("ToJump");}}><button aria-label="Jump Down to the stock table" className="ViewMore">          
            <div className={`ArrowOne ${JumpTo == "#ToJump" ? "Top" : ""}`} ></div>
            <div className={`ArrowTwo ${JumpTo == "#ToJump" ? "Top" : ""}`} ></div></button>
          </a>

          {errorCode &&
            <FocusTrap>
              <div className="ToBuyModal" aria-labelledby="RegistrationError" role='dialog' aria-modal="true">
                <ErrorPopup 
                  ErrorCode={errorCode}
                  Confirm={() => {resetError()}}
                  />
              </div>
            </FocusTrap>
          }
          
          {modalVisible && 
            <DeletePortfolioStockModal
              stocks={portfolio.stocks}
              toDelete={toDelete}
              cancelDelete={cancelDelete}
              handleTrueDelete={handleTrueDelete}
          />}

        </>
      )
};

export default Portfolio;

