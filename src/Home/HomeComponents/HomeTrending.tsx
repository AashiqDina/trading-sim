import React from "react";
import './HomeTrending.css'
import { stockList, trendingStocksList } from "../../types";

type props = {
    stockList: stockList; 
    trendingStocksList: trendingStocksList
    searchStock: (symbol: string) => void
}


const HomeTrending = ({stockList, trendingStocksList, searchStock}: props) => {

    const symbolMap = React.useMemo(() => {
        if(!stockList) return {}
        return Object.fromEntries(
            Object.entries(stockList).map(([name, value]) => [
                value.symbol,
                { name, logo: value.logo }
    ]))}, [stockList]);

    if(!trendingStocksList || !(trendingStocksList.length > 0)){
        return (<h3 className='NoNewsFoundHeading'>No Stocks Currently Trending</h3>) 
    }
    return (  
        <section className='CompleteTrendingBody'>
            <article className='TrendingStocksSectionTitle'>
                <h2>Trending Stocks</h2>
            </article>
            <article className='TrendingStocksSection'>
            <div className='TrendingStocksCarouselContainer'>
                  <div className='TrendingStocksCarouselTrack'>
                    {[...trendingStocksList].concat([...trendingStocksList]).map((stock, index) => {
                    const data = symbolMap[stock];
                    return (
                        <button
                        data-testid="trendingStocks" 
                        key={`${stock}-${index}`}
                        aria-label={data?.name || "Unknown Stock"}
                        className='TrendingStockDiv'
                        onClick={() => data && searchStock(stock)}
                        >
                        <img src={data?.logo || process.env.PUBLIC_URL + "/Error.svg"} alt={data?.name || 'Unknown Stock Logo'} />
                        <h2>{data?.name || "Error - No Stock Found"}</h2>
                        </button>
                    )
                    })}
                </div>
            </div>
            </article>  
            
    </section>
    )
}

export default React.memo(HomeTrending)