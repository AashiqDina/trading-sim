import { DisplayedDataType } from "../../../types/types";

type Props = {
    stockLogo: string;
    stockName: string;
    stockSymbol: string;
    stockPrice: number;
    DisplayedData: DisplayedDataType;
    userExists: boolean;
    switchSection: (section: DisplayedDataType) => void;
    changeBuyModal: () => void;
}

export default function StockDetailsHeader({stockLogo, stockName, stockSymbol, stockPrice, DisplayedData, userExists, switchSection, changeBuyModal}: Props){

    return (
        <header className='TitleBox'>
          <section className='TitleSec'>
            <img className='TitleLogo' src={stockLogo} alt={`Logo`} />
              <article className='StockDetailsPrice'>
                <div className='MiniNameSymbolSection'>
                  <h1 className='StockDetailsTitle'>{stockName}<span className='StockSymbol'>{stockSymbol}</span></h1>
                </div>
                <h2 style={stockName && stockName.length > 18 ? {marginTop: "0.5rem"} : undefined}>£{typeof stockPrice === "number" ? stockPrice?.toFixed(2) : "..."}</h2>
              </article>
          </section>
          <section className='CompleteSelector'>
            <section className='SectionSection'>
              <article className='Selector'>
                {userExists && <button className='BuyStockButton' aria-label='Buy Stock' onClick={changeBuyModal}>Buy Stock</button>}
                <button aria-pressed={DisplayedData === "Overview"} aria-label="View overview" onClick={() => switchSection("Overview")} className={"Overview" + (DisplayedData === "Overview" ? "Selected" : "")}>Overview</button>
                <button aria-pressed={DisplayedData === "CompanyInformation"} aria-label="View company information" onClick={() => switchSection("CompanyInformation")} className={"CompanyInformation" + (DisplayedData === "CompanyInformation" ? "Selected" : "")}>About</button>
                <button aria-pressed={DisplayedData === "StockData"} aria-label="View stock data" onClick={() => switchSection("StockData")} className={"StockData" + (DisplayedData === "StockData" ? "Selected" : "")}>Stock Data</button>
                {userExists && <button aria-pressed={DisplayedData === "OwnedStocks"} aria-label="View owned stocks" onClick={() => switchSection("OwnedStocks")} className={"OwnedStocks" + (DisplayedData === "OwnedStocks" ? "Selected" : "")}>Owned Stocks</button>}
                <button aria-pressed={DisplayedData === "News"} aria-label="View stock related news" onClick={() => switchSection("News")} className={"News" + (DisplayedData === "News" ? "Selected" : "")}>News</button>
              </article>
            </section>
          </section>
        </header>
    )
}