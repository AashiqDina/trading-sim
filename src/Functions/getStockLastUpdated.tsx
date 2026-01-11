import axios from "axios"


export default async function getStockLastUpdated(symbol: string){
    let LastUpdatedDictionary = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetStockLastUpdated/${symbol}`)
    return LastUpdatedDictionary.data.data

}
