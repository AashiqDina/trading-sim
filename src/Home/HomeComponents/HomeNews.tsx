import { useEffect, useRef, useState } from "react";
import { marketNews } from "../../types";
import Loading from "../../Loading/Loading";
import './HomeNews.css'
// import SponsoredAd from "../../Ads/SponsoredAd";

type Props = {
    marketNews: marketNews[]
}

const HomeNews = ({ marketNews }: Props) => {

    const [newsIndex, setIndex] = useState<number>(0)
    const pageSize = 3;

    function navigateNews(direction: "left" | "right"){
        const maxIndex = marketNews.length - pageSize;
        
        if(direction === "left"){
            setIndex(prev => (prev === 0) ? maxIndex : prev-pageSize)
        }
        else{
            setIndex(prev => (prev >= maxIndex) ? 0 : prev+pageSize)
        }
    }

    if(!marketNews) return <></>

    if(marketNews?.length === 0) return (
        <section className='MotherBody2'>
          <article className='HomeNewsSection' style={{justifyContent: 'center'}}>
            <h3 className='NoNewsFoundHeading'>No News Found</h3>
          </article>
        </section>
    )

    return (
        <>
            <section className='NewsTitleSection'>
                <section className='HomeNewsSectionTitle'>
                <article>
                    <h2>Today's News</h2>
                    {marketNews.length >= pageSize ?
                        <div className='newsArrowContainer'>
                            <button aria-label="Navigate left" className='newsArrowTriangleContainer' onClick={() => navigateNews("left")}>
                                <div className='newsLeftArrow'></div>
                            </button>
                            <button aria-label="Navigate right" className='newsArrowTriangleContainer' onClick={() => navigateNews("right")}>
                                <div className='newsRightArrow'></div>
                            </button>
                        </div> : undefined
                    }
                </article>
                </section>
            </section>

            <section className='MotherBody2'>
                <article className='HomeNewsSection'>
                {/* {false && <SponsoredAd></SponsoredAd>}  */}
                {marketNews.slice(newsIndex, newsIndex + pageSize).map((news, index) => {
                    return (
                        <a href={news.url || "brokenURL"} aria-label={`Read news: ${news.headline || "brokenHeadline"}`} className={'CompleteMarketNews'} key={news.url + '--' + newsIndex + '-' + index} style={{animationDelay: `${index * 0.1}s`}}>
                            <div className='marketNewsImage'>
                                <img src={news.image || "brokenSource"} alt={news.source + " image" || "brokenSource"} />
                            </div>
                            <div className='marketNewsContainer'>
                            <div className={'marketNewsHeader'}>
                                <img className='newsImageInHeader' src={news.image || "brokenSource"} alt={news.source + " image"}/>
                                <h3>{news.headline || "brokenHeadline"}</h3>
                            </div>
                            <div className='marketNewsBody'>
                                <p>{news.summary || "brokenSummary"}</p>
                            </div>
                            <div className='marketNewsFooter'>
                                <p>Source: <span>{news.source || "brokenSource"}</span></p>
                                <p>{new Date(news.datetime * 1000 || 0).toLocaleString("en-GB", {
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
                    })
                }
                </article>
            </section>
            </>
    )
}

export default HomeNews