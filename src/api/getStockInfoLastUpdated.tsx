import axios from "axios"

export default async function getStockInfoLastUpdated(symbol: string){
    try{
        let LastUpdatedDictionary = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetStockInfoLastUpdated/${symbol}`)
        return LastUpdatedDictionary.data.data
    }
    catch(err){

    }
}
