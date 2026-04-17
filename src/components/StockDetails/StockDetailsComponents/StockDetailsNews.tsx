import { useEffect, useState } from "react"
import "./StockDetailsNews.css"
import { MarketNews } from "../../../types/types"
import Loading from "../../Loading/Loading"

type props = {
  marketNews: MarketNews[],
  fetchStockNews: () => void,
  loading: boolean,
}

export default function StockDetailsNews({loading, marketNews, fetchStockNews}: props){

  const [amountNewsDisplay, setAmountNewsDisplay] = useState<number>(5)

  useEffect(() => {
    fetchStockNews()
  }, [fetchStockNews])

  if(loading) return ( <Loading scale={0.8}/> )

  return(
      <section>
        <article className="ArticleCollection">
          {marketNews?.slice(0, amountNewsDisplay).map((article: MarketNews, index: number) => {
              return(
                <a key={index} className="NewsArticle" href={article.url}>
                  <img src={article.image} alt="" />
                  <div>
                    <h2>{article.headline}</h2>
                    <p>{article.summary}</p>
                    <div>
                      <p className="Source">Source: {article.source}</p>
                      <p className="Date">{new Date(article.datetime * 1000).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}</p>
                    </div>
                  </div>
                </a>
              )
          })}
        </article>

        <article className="MoreNewsArticles">
          {amountNewsDisplay < marketNews.length ?
            <button className="SeeMoreNews" onClick={() => {setAmountNewsDisplay(amountNewsDisplay+5)}}>
              View More
            </button> : 
            marketNews?.length == 0 ? <h2>No Articles</h2> : <h2>No more Articles.</h2>
          }
        </article>
      </section>
  )
}