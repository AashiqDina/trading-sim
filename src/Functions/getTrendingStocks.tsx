import axios from "axios"

export default async function getTrendingStocks(props: any){
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/GetTrendingStocks`)


        
        if(result.data.hasError){
            props.setDisplayError({
                display: true, 
                title: "Our Trending Stocks are a bit shy", 
                bodyText: "Looks like they've hid somewhere", 
                warning: false, 
                buttonText: "Retry"})
            return null;
        }
        return result.data.trendingStocks


    }
    catch(error){
        props.setDisplayError({
            display: true, 
            title: "Couldn't reach the backend", 
            bodyText: "Looks like our servers took a coffee break. Try again in a moment!", 
            warning: false, 
            buttonText: "Retry"})
        return [];
    }

}
