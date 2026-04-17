import { useEffect, useState } from "react";
import getStockImage from "../api/getStockImage";
import getStockName from "../api/getStockName";
import { ApiError } from "../error/ApiError";
import buyStockService from "../services/buyStockService";

type props = {
    userId: number | undefined,
    stockSymbol: string
    setErrorCode: (code: number | null) => void
}

export function useStockDetails({ userId, stockSymbol, setErrorCode }: props){
    const [stockName, setStockName] = useState<string>("")
    const [stockLogo, setStockLogo] = useState<string>("")
    const [showConfetti, setShowConfetti] = useState(false);
    const [buyModalOpen, setBuyModalOpen] = useState(false)

    useEffect(() => {
        const GetData = async () => {
            try{
                console.log("SS: ", stockSymbol)
                const [stockName, stockImage] = await Promise.all([
                    getStockName(stockSymbol),
                    getStockImage(stockSymbol)
                ])


                setStockName(stockName);
                setStockLogo(stockImage);
            }
            catch(error){
                console.log(error)
            }
        }
        GetData()
    }, [stockSymbol])

    const changeBuyModal = () => {setBuyModalOpen(!buyModalOpen)}

    const handlebuyStock = async (stockPrice: number, quantity: string) => {

        try{
            if(!userId) throw new ApiError(1000)

            await buyStockService({
                userId: userId,
                stockPrice:stockPrice,
                stockSymbol: stockSymbol,
                quantity: Number(quantity)})
            setShowConfetti(true)
            setTimeout(() => {setShowConfetti(false)}, 10000)
            setBuyModalOpen(false)
        }
        catch(err){
            if (err instanceof ApiError) {
            setErrorCode(err.code);
            } else {
            setErrorCode(-1);
            }
        }
    }

    return { stockName, stockLogo, showConfetti, buyModalOpen, handlebuyStock, changeBuyModal }
}