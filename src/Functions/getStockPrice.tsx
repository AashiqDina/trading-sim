import axios from "axios"
import handleTwelveDataError from "../Error/handleTwelveDataError";

export default async function getStockPrice(props: any){
    try{
        const result = await axios.get(`https://tradingsim-backend.onrender.com/api/stocks/${props.symbol}`)

        if(result.data.response.hasError){
            if(result.data.response.errorCode == 404){
                props.setDisplayError({
                    display: true, 
                    title: "Hmm… couldn’t find that stock.", 
                    bodyText: "Please double-check that the symbol you entered is correct.", 
                    warning: false, 
                    buttonText: "Retry"})
            }
            else{
                handleTwelveDataError({
                    response: result.data.response,
                    setDisplayError: props.setDisplayError
                });
            }
            return null;
            
        }
        else{
            return result.data.response.data;
        }

    }
    catch(error){
        props.setDisplayError({
            display: true, 
            title: "Couldn't reach the backend", 
            bodyText: "Looks like our servers took a coffee break. Try again in a moment!", 
            warning: false, 
            buttonText: "Retry"})
        return null;
    }

}
