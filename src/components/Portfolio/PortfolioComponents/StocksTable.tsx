import { FocusTrap } from 'focus-trap-react';
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHoursAgo } from '../../../utils/getHoursAgo';
import { getGreatestProfitLoss } from '../../../functions/getGreatestProfitLoss';
import { PortfolioStock, PortfolioTableStock, Transaction } from '../../../types/types';
import DeletePortfolioStockModal from './DeletePortfolioStockModal';

type props = {
  LastUpdatedDictionary: Map<string, Date> | null,
  tableStocks: PortfolioTableStock[],
  owner: boolean,
  setFilteredOption: React.Dispatch<React.SetStateAction<string>>,
  setSearchInput: React.Dispatch<React.SetStateAction<string>>,
  handleDelete: (stock: Transaction) => void,
}

function StocksTable({LastUpdatedDictionary, tableStocks, owner, handleDelete, setFilteredOption, setSearchInput}: props){

  const [IndexExpanded, setIndexExpanded] = useState<number | null>(null)
  const { greatestProfit, greatestLoss } = getGreatestProfitLoss(tableStocks);
  const navigate = useNavigate();

    return (
        <section className="PortfolioHoldings">
          <article className="genericFlexRow" style={{marginBottom: "4rem"}}>
            <div style={{width: "25%", margin: 0}} className="LineOne"></div>
            <h2 className="PageTitleHoldings">Holdings</h2>
            <div style={{width: "25%", margin: 0}} className="LineOne"></div>
          </article>

          
          <article className="Filter">
            <input  aria-label="Enter a stock name or symbol to fiter your stocks" type="text" onChange={(e) => setSearchInput(e.target.value.toUpperCase())} placeholder="Enter stock symbol/name (e.g, AAPL, Apple)"/>
            <select aria-label="Sort your stocks" name="" id="" onChange={(e) => setFilteredOption(e.target.value)}>
              <option value="">Sort by</option>
              <option value="Oldest">Oldest</option>
              <option value="Newest">Newest</option>
              <option value="ProfitAsc">Profit (Asc)</option>
              <option value="ProfitDesc">Profit (Desc)</option>
              <option value="ValueAsc">Value (Asc)</option>
              <option value="ValueDesc">Value (Desc)</option>
            </select>
          </article>

          { greatestProfit?.Company != "None" && <article className='QuickPerformance'>

              <div className='BestPerformerCard'>
              <div>
                <h3>Best Performer</h3>
              </div>
              <div className='CardStock'>
                <img src={greatestProfit?.Logo ? greatestProfit?.Logo : undefined} alt="Logo" /> 
                <h4>{greatestProfit?.Company}</h4>
              </div>
              <p style={greatestProfit?.Value && greatestProfit?.Value > 0 ? {color: "#45a049"} : {color: "rgb(187, 21, 21)"}}>
                {greatestProfit?.Value && greatestProfit?.Value > 0 ? "▲ +" : "▼ "}
                {greatestProfit?.Value != null ? greatestProfit?.Value.toFixed(2) : undefined}%
              </p>
            </div>

            <div className='WorstPerformerCard'>
              <div>
                <h3>Worst Performer</h3>
              </div>
              <div className='CardStock'>
                <img src={greatestLoss?.Logo ? greatestLoss?.Logo : undefined} alt="Logo" /> 
                <h4>{greatestLoss?.Company}</h4>
              </div>
              <p style={greatestLoss?.Value != null && greatestLoss?.Value > 0 ? {color: "#45a049"} : {color: "rgb(187, 21, 21)"}}>
                {greatestLoss?.Value && greatestLoss?.Value > 0 ? "▲ +" : "▼ "}
                {greatestLoss?.Value != null ? greatestLoss?.Value.toFixed(2) : undefined}%
              </p>  
            </div>
          </article>}


          <article className="StocksTable">
            <table className="Table" style={{transition: "all 0.6s ease-in-out"}}>
              <thead>
                <tr>
                  <th className="thLogo"></th>
                  <th className="thCompanies">Companies</th>
                  <th className="thBoughtPrice">Bought Price</th>
                  <th className="thCurrentValue">Current Value</th>
                  <th className="thProfit" style={IndexExpanded != null ? {paddingRight: 0} : undefined}>Profit/Loss</th>
                  {IndexExpanded != null ? <th style={{padding: 0}}></th> : null}

                </tr>
              </thead>
                <tbody style={{transition: "all 0.6s ease-in-out"}}>
                  {tableStocks.map((stockAvg: PortfolioTableStock, index: number) => { 
                  return (
                    <React.Fragment key={stockAvg.symbol}>                    
                    <tr onClick={() => IndexExpanded == index ? setIndexExpanded(null) : setIndexExpanded(index)} style={{cursor: "pointer",transition: "all 0.6s ease-in-out"}}>
                      <td className="tdLogo"><button aria-label='Visit Stock Details Page' onClick={ () => {navigate(`/stock/${encodeURIComponent(String(stockAvg.symbol ?? ''))}`)}} className='tdLogoButton'><img className="StockLogos" src={stockAvg.logo} alt="Stock Logo" /></button></td>
                      <td className="tdCompanies"><div><div><button aria-label='Expand Stock to see individual stocks bought'><h3>{stockAvg.name}</h3><span>Quantity: {Math.round(stockAvg.totalShares*100)/100}</span></button></div></div></td>
                      <td className="tdBoughtPrice"><div>£{stockAvg.totalCost.toFixed(2)}<span>Average: £{stockAvg.avgBuyPrice.toFixed(2)}</span></div></td>
                      <td className="tdCurrentValue"><div>£{stockAvg.currentWorth.toFixed(2)}<span className={"LastUpdatedStockTableValue"}>
                        {LastUpdatedDictionary?.get(stockAvg.symbol)
                          ? getHoursAgo(LastUpdatedDictionary.get(stockAvg.symbol))
                          : "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="tdProfit"><div><div>£{(stockAvg.currentWorth - stockAvg.totalCost).toFixed(2)}<span style={{color: (((((stockAvg.currentWorth/stockAvg.totalCost)*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((((stockAvg.currentWorth/stockAvg.totalCost)*100)-100) > 0) ? "+" : null}{(((stockAvg.currentWorth/stockAvg.totalCost)*100)-100).toFixed(1)}%</span></div></div></td>
                      {IndexExpanded != null ? <td style={{padding: 0}}></td> : null}
                    </tr>
                    {IndexExpanded == index && stockAvg.transactions.map((stock: Transaction, i: number) => (
                      <tr key={i}>
                        <td className="tdLogoMore">
                          <div style={{height: "10px", width: "10px", transform: "rotate(-90deg)", marginLeft: "20px", scale: "0.85"}}>
                            <div className={`MoreStocksLine`} ></div>
                          </div>
                        </td>
                        <td className="tdCompanies" ><div><div><p style={{fontWeight: 400}}>{stockAvg.name}</p><span>Quantity: {stock.quantity}</span></div></div></td>
                        <td className="tdBoughtPrice"><div><div><p style={{fontWeight: 400}}>£{(stock.purchasePrice* stock.quantity).toFixed(2)}</p><span>Each: {stock.purchasePrice.toFixed(2)}</span></div></div></td>
                        <td className="tdCurrentValue">£{(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                        <td className="tdProfit"><div><div>£{((stock.currentPrice - stock.purchasePrice)*stock.quantity).toFixed(2)}<span style={{color: (((((stock.currentPrice/stock.purchasePrice)*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((((stock.currentPrice/stock.purchasePrice)*100)-100) > 0) ? "+" : null}{(((stock.currentPrice/stock.purchasePrice)*100)-100).toFixed(1)}%</span></div></div></td>
                        {owner && <td className="DeleteButton">
                          <button aria-label='DeleteStock' className="CrossContainer" onClick={() => {
                            handleDelete(stock)
                          }}>
                            <div className="Cross1"></div>
                            <div className="Cross2"></div>
                          </button>
                        </td>}

                      </tr>
                    ))}
                    </React.Fragment>
                  )})}

                </tbody>

            </table>
          </article>
        </section>
    )

}

export default React.memo(StocksTable)
















