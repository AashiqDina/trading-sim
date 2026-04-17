import { PortfolioTableStock } from "../types/types"

export function getGreatestProfitLoss(tableStocks: PortfolioTableStock[]){

    if(tableStocks.length == 0) return {
        GreatestProfit: {
            Company: "None",
            Logo: "None",
            Profit: 0,
            Value: 0
        },
        GreatestLoss: {
            Company: "None",
            Logo: "None",
            Profit: 0,
            Value: 0
        }
    }

    let profit = tableStocks[0].currentWorth-tableStocks[0].totalCost

    let greatestProfit = {
        Company: tableStocks[0].name, 
        Logo: tableStocks[0].logo, 
        Profit: profit,
        Value: tableStocks[0].profitPercent
    }
    let greatestLoss = {
        Company: tableStocks[0].name,
        Logo: tableStocks[0].logo,
        Profit: profit,
        Value: tableStocks[0].profitPercent
    }

    for(let i = 1; i<tableStocks.length; i++){

        let Profit = tableStocks[i].currentWorth-tableStocks[i].totalCost

        if(Profit > greatestProfit.Profit){
          greatestProfit = {
            Company: tableStocks[i].name,
            Logo: tableStocks[i].logo,
            Profit: Profit,
            Value: tableStocks[i].profitPercent}
        }
        if(Profit < greatestLoss.Profit){
          greatestLoss = {
            Company: tableStocks[i].name,
            Logo: tableStocks[i].logo,
            Profit: Profit,
            Value: tableStocks[i].profitPercent}
        }

    }

    return {greatestProfit, greatestLoss}

}