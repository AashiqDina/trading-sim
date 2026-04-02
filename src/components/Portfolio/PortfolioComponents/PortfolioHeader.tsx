type props = {
    username: string,
    totalInvested: number,
    currentValue: number,
    profitLoss: number
}

export default function PortfolioHeader({ username, totalInvested, currentValue, profitLoss} : props){
    return(
        <section className="PortfolioPageHeader">
            <article className="PortfolioPageTitle">
              
              <h2 className="PageTitle">{username + "'s"} Portfolio</h2>
              <div className="LineOne"></div>
            </article>
            <article className="PortfolioSummary">
              <div>
                <h4>Invested</h4>
                <h5>£{totalInvested.toFixed(2)}</h5>
              </div>
              <div className="PortfolioSummaryCenter">
                <h3>Portfolio Value</h3>
                <h4>£{currentValue.toFixed(2)}</h4>
              </div>
              <div>
                <h4>Profit</h4>
                <h5>{profitLoss >= 0 ? "+" : "-"}£{Math.abs(profitLoss).toFixed(2)}
                </h5>
                <div>
                  <span style={profitLoss >= 0 ? {color: '#45a049'} : {color: '#bb1515'}}>
                    {profitLoss >= 0 ? "+" : ""}{(currentValue && totalInvested) ? (((currentValue/totalInvested)*100-100).toFixed(2)) : ""}{(currentValue != null && totalInvested != null) ? "%" : ""}
                  </span>
                </div>
              </div>
            </article>
          </section>
    )
}