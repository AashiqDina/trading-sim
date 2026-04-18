import { FocusTrap } from "focus-trap-react";
import { useState } from "react";

type props = {
    stockName: string
    stockLogo: string
    stockSymbol: string
    stockPrice: number | undefined
    handlebuyStock: (stockPrice: number, quantity: string) => Promise<void>
    changeBuyModal: () => void
}

export default function BuyStockModal({ stockName, stockLogo, stockSymbol, stockPrice, handlebuyStock, changeBuyModal }: props){
    const [quantity, setQuantity] = useState<string>("0");
    const [cost, setCost] = useState<string | null>(null);

    return (
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
                    if (stockPrice) handlebuyStock(stockPrice, quantity);
                }}>
                <div className='toBuyBody'>
                    <label htmlFor="quantity">Number of Shares:</label>
                    <input                         
                        aria-label="Enter the quantity here (or leave it blank if you wish to spend a specific amount)"
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => {setQuantity(e.target.value); setCost((Number(e.target.value)*(stockPrice || 0)).toFixed(2))}}
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
                        value={(cost || String(Number(quantity)*(stockPrice || 0)))}
                        onChange={(e) => {
                        let q = (Number(e.target.value)/(stockPrice || 0))
                        setQuantity(q.toFixed(2)); 
                        setCost((Number(q)*(stockPrice || 0)).toFixed(2))}}
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
    )
}