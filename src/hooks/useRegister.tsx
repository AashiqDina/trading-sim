import { useState } from "react";
import handleRegister from "../api/handleRegister";
import checkUsername from "../api/checkUsername";
import { ApiError } from "../error/ApiError";
import { useNavigate } from "react-router-dom";

export function useRegister(){
    const navigate = useNavigate();


    const [error, setError] = useState<string>("");
    const [errorCode, setErrorCode] = useState<number | null>(null);
    
    const resetError = () => {
        setError("");
        setErrorCode(null);
    };

    const toRegister = async (username: string, password: string, confirmPassword: string) => {

        // e.preventDefault();
        setError("");
    
        try {

            await checkUsername(username)
        
            if (password !== confirmPassword) throw new ApiError(1004) // Passwords do not match
        
            await handleRegister(username, password)
            navigate("/")
        
        } 
        catch (err) {
            if(err instanceof ApiError){
                if(err.code === 1002) setError("Error Checking Username Availability")
                else if(err.code === 1003) setError("Username Already Taken")
                else if(err.code === 1004) setError("Passwords Do Not Match")
                else setErrorCode(err.code)
            }
            else{
                setErrorCode(-1)
            }
        }
    };

    return {toRegister, error,  errorCode, resetError}
}