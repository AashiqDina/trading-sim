import { usePortfolioData } from "./usePortfolioData";
import { usePortfolioActions } from "./usePortfolioActions";

type Props = {
  userId?: number | null;
}

export function usePortfolio({ userId }: Props){    

    const {portfolio, fullHistory, loading, dataErrorCode, resetDatasError, refreshPortfolio, LastUpdatedDictionary} = usePortfolioData({userId})
    const { handleDeleteStock, actionsErrorCode, resetActionsError } = usePortfolioActions()
    const errorCode = dataErrorCode ?? actionsErrorCode 

    const resetError = () => {
        resetActionsError()
        resetDatasError()
    };

    return { portfolio, fullHistory, loading, errorCode, resetError, handleDeleteStock, refreshPortfolio, LastUpdatedDictionary };
}