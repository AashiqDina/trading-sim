import { useCallback, useState } from "react"
import { ApiError } from "../error/ApiError"
import { CompanyProfile } from "../types/types"
import getCompanyInformation from "../api/getCompanyInformation"


type props = {
    symbol: string
    handleError: (err: unknown) => void
}

export function useStockDetailsInfo({symbol, handleError}: props){
    const [infoLoading, setLoading] = useState<boolean>(false)
    const [companyInformation, setCompanyInformation] = useState<CompanyProfile | null>(null)


    const fetchStocksInfo = useCallback(async () => {
        try{
            setLoading(true)
            const data = await getCompanyInformation({symbol: symbol})
            setCompanyInformation(data)
        }
        catch(err){
            handleError(err)
        }
        finally{
            setLoading(false)
        }
    }, [symbol])


    return { infoLoading, companyInformation, fetchStocksInfo }
}