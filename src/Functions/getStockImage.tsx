import axios from "axios"
import handleTwelveDataError from "../Error/handleTwelveDataError";

export default async function getStockImage(props: any){
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/StockImage/${props.symbol}`)

        if(result.data.image.hasError){
            handleTwelveDataError({
                response: result.data.image,
                setDisplayError: props.setDisplayError
            });
            return null;
        }
        else{
            return result.data.image.data
        }

    }
    catch(error){
        props.setDisplayError({
            display: true, 
            title: "Couldn't reach the backend to get the stock's image", 
            bodyText: "Looks like our servers took a coffee break. Try again in a moment!", 
            warning: false, 
            buttonText: "Retry"})
        return null;
    }

}
