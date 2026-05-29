import { useState } from "react";
import { ApiError } from "../../error/ApiError";
import deleteStock from "../../api/deleteStock";
import DeleteAccount from "../../api/DeleteAccount";

export function usePortfolioActions(){
    const [actionsErrorCode, setErrorCode] = useState<number | null>(null)

    const resetActionsError = () => {
        setErrorCode(null);
    };

    const handleDeleteStock = async (userId: number, stockId: number) => {
        try {
            await deleteStock(userId, stockId);
            setErrorCode(null);
            return true;
        } 
        catch (error) {
            if (error instanceof ApiError) {
                setErrorCode(error.code);
            } 
            else {
                setErrorCode(-1);
            }
            return false
        }
    };
    
    const handleDeleteUser = async (userId: number, Confirmation: boolean) => {
        try {
            await DeleteAccount({userId, Confirmation});
            setErrorCode(null);
            return true;
        } 
        catch (error) {
            console.log(error)
            if (error instanceof ApiError) {
                setErrorCode(error.code);
            } 
            else {
                setErrorCode(-1);
            }
            return false
        }
    }

    return { handleDeleteStock, handleDeleteUser, actionsErrorCode, resetActionsError };
}