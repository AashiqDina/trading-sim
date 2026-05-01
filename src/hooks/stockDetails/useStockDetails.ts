import { useEffect, useState } from "react";
import getStockImage from "../../api/getStockImage";
import getStockName from "../../api/getStockName";
import { ApiError } from "../../error/ApiError";
import buyStockService from "../../services/buyStockService";

type props = {
    userId: number | undefined,
    stockSymbol: string
    handleError: (err: unknown) => void
}

export function useStockDetails({ userId, stockSymbol, handleError }: props){
    const [baseLoading , setBaseLoading] = useState(false)
    const [stockName, setStockName] = useState<string>("")
    const [stockLogo, setStockLogo] = useState<string>("")
    const [showConfetti, setShowConfetti] = useState(false);
    const [buyModalOpen, setBuyModalOpen] = useState(false)

    useEffect(() => {
        const getData = async () => {
            try{
                setBaseLoading(true)
                const [stockName, stockImage] = await Promise.all([
                    getStockName(stockSymbol),
                    getStockImage(stockSymbol)
                ])

                setStockName(stockName);
                setStockLogo(stockImage);
            }
            catch(error){
                handleError(error)
            }
            finally{
                setBaseLoading(false)
            }
        }
        getData()
    }, [stockSymbol, handleError])

    const changeBuyModal = () => {setBuyModalOpen(!buyModalOpen)}

    const handleBuyStock = async (stockPrice: number, quantity: string) => {

        try{
            if(isNaN(Number(quantity))) throw new ApiError(1002)
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
            handleError(err)
        }
    }

    return { baseLoading, stockName, stockLogo, showConfetti, buyModalOpen, handleBuyStock, changeBuyModal }
}