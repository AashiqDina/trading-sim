import { FocusTrap } from "focus-trap-react"
import { PortfolioStock, Transaction } from "../../../types/types"

type props = {
    stocks: PortfolioStock[],
    toDelete: Transaction | null,
    cancelDelete: () => void,
    handleTrueDelete: () => void,
}

export default function DeletePortfolioStockModal({stocks, toDelete, cancelDelete, handleTrueDelete}: props){

    if(!stocks || !toDelete) return null

    const delStock = stocks.find(s => s.id === toDelete.id);
    if (!delStock) return null

    const profitPct = ((delStock.currentPrice / delStock.purchasePrice) * 100) - 100;

    return(
        <FocusTrap>
            <div className="Modal">
                <div className="ModalContent">
                <h2>Are you sure you want to delete?</h2>
                <div>
                    <table className="Table" style={{transition: "all 0.6s ease-in-out", scale: 0.8}}>
                    <thead>
                        <tr>
                            <th className="thLogo"></th>
                            <th className="thCompanies">Companies</th>
                            <th className="thBoughtPrice">Bought Price</th>
                            <th className="thCurrentValue">Current Value</th>
                            <th className="thProfit" style={{paddingRight: 0}}>Profit/Loss</th>
                            <th style={{padding: 0}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="tdLogoMore">
                                <img className="StockLogos"  src={delStock.logo} alt="" style={{width: "60px", padding: "none", margin: "none"}}/>
                            </td>
                            <td className="tdCompanies" ><div><div><p style={{fontWeight: 400}}>{delStock.name}</p><span>Quantity: {delStock.quantity}</span></div></div></td>
                            <td className="tdBoughtPrice">£{(delStock.purchasePrice * delStock.quantity).toFixed(2)}</td>
                            <td className="tdCurrentValue">£{(delStock.quantity * delStock.currentPrice).toFixed(2)}</td>
                            <td className="tdProfit"><div><div>£{profitPct.toFixed(2)}<span style={{color: ((((profitPct)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((profitPct-100) > 0) ? "+" : null}{(profitPct-100).toFixed(1)}%</span></div></div></td>
                        </tr>
                    </tbody>
                </table>
                </div>

                <div className="ModalFooter">
                    <button aria-label='Cancel?' className="" onClick={() => {
                    cancelDelete()
                    }}>Cancel</button>
                    <button aria-label='Delete Stock?' className="" onClick={handleTrueDelete}>Delete</button>
                </div>
                </div>
            </div>
        </FocusTrap>
    )

}