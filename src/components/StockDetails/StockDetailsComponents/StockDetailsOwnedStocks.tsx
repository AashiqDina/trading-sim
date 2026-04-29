import { useEffect } from "react";
import { PortfolioStock } from "../../../types/types";
import Loading from "../../Loading/Loading";
import { getHoursAgo } from "../../../utils/getHoursAgo";
import { useStockDetailsOwnedStocks } from "../../../hooks/stockDetails/useStockDetailsOwnedStocks";

type Props = {
    user: number | undefined
    symbol: string
    handleError: (err: unknown) => void
}

export default function StockDetailsOwnedStocks({user, symbol, handleError}: Props){

  const { ownedStocksLoading, ownedStocks, lastUpdated, fetchOwnedStocks} = useStockDetailsOwnedStocks({symbol: symbol, user: user, handleError: handleError})


  useEffect(() => {
    fetchOwnedStocks()
  }, [fetchOwnedStocks])

  if(ownedStocksLoading) return <Loading scale={0.8}/>

  if(ownedStocks.length === 0) return (
    <div>
      <h2>You don't own any stocks from this company</h2>
    </div>
  )

  return(
    <>
        <div className="StocksTable" style={{marginTop: "1rem"}}>
          <table className="Table" style={{transition: "all 0.6s ease-in-out"}}>
            <thead>
              <tr>
                <th className="thLogo"></th>
                <th className="thCompanies">Companies</th>
                <th className="thBoughtPrice">Bought Price</th>
                <th className="thCurrentValue">Current Value</th>
                <th className="thProfit">Profit/Loss</th>
              </tr>
              </thead>

              <tbody>
                {ownedStocks.map((stock: PortfolioStock, index: number) => (
                  <tr key={index}>
                    <td className="tdLogo"><img className="StockLogos" src={stock.logo} alt="Stock Logo" /></td>
                    <td className="tdCompanies"><div><div><h3>{stock.name}</h3><span>Quantity: {stock.quantity}</span></div></div></td>
                    <td className="tdBoughtPrice"> £{(stock.purchasePrice*stock.quantity).toFixed(2)}</td>
                    <td className="tdCurrentValue"><div>£{(stock.currentPrice*stock.quantity).toFixed(2)}<span className={"LastUpdatedStockTableValue"}>
                      {lastUpdated?.get(stock.symbol)
                        ? getHoursAgo(lastUpdated.get(stock.symbol))
                        : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="tdProfit"><div><div>£{((stock.currentPrice*stock.quantity) - (stock.purchasePrice*stock.quantity)).toFixed(2)}<span style={{color: ((((((stock.currentPrice*stock.quantity)/(stock.purchasePrice*stock.quantity))*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{(((((stock.currentPrice*stock.quantity)/(stock.purchasePrice*stock.quantity))*100)-100) > 0) ? "+" : null}{(((stock.currentPrice*stock.quantity)/(stock.purchasePrice*stock.quantity)*100)-100).toFixed(1)}%</span></div></div></td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
  )

}