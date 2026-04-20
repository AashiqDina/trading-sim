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
    const [cost, setCost] = useState<string>("");

    const formatValues = () => {
        if (quantity !== "") {
            setQuantity(Number(quantity).toFixed(2));
        }
        if (cost !== "") {
            setCost(Number(cost).toFixed(2));
        }
        };


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
                    if (stockPrice && isFinite(Number(quantity))) handlebuyStock(stockPrice, quantity);        
                }}>
                <div className='toBuyBody'>
                    <label htmlFor="quantity">Number of Shares:</label>
                    <input
                        className="QuantityInput"
                        aria-label="Enter the quantity here (or leave it blank if you wish to spend a specific amount)"
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            const value = e.target.value;
                            setQuantity(value);

                            if (value === "") {
                                setCost("");
                                return;
                            }

                            const quantity = Number(value);
                                if (!isNaN(quantity)) {
                                setCost((quantity * (stockPrice || 0)).toString());
                            }
                        }}
                        onBlur={formatValues}
                        />
                    <label htmlFor="cost">Estimated Cost:</label>
                    <input
                        className="QuantityInput"
                        aria-label="Enter the Price here (or leave it blank if you wish to buy a specific amount of stocks)"
                        id="cost"
                        type="number"
                        value={cost}
                        onChange={(e) => {
                            const value = e.target.value;
                            setCost(value);

                            if (value === "") {
                                setQuantity("");
                                return;
                            }

                            const c = Number(value);
                                if (!isNaN(c) && stockPrice) {
                                setQuantity((c / stockPrice).toString());
                            }
                        }}
                        onBlur={formatValues}
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