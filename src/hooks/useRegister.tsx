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

            if(username.length < 3) throw new ApiError(1006) // Usernames need to be at least 3 characters 
            await checkUsername(username)
        
            if (password !== confirmPassword) throw new ApiError(1004) // Passwords do not match
            else if(password.length < 8) throw new ApiError(1005) // Passwords need to be at least 8 characters
            
            await handleRegister(username, password)
            navigate("/login")
        
        } 
        catch (err) {
            if(err instanceof ApiError){
                if(err.code === 1002) setError("Error Checking Username Availability")
                else if(err.code === 1003) setError("Username Already Taken")
                else if(err.code === 1004) setError("Passwords Do Not Match")
                else if(err.code === 1005) setError("Passwords Need To Be At Least 8 Characters")
                else if(err.code === 1006) setError("Usernames Need To Be At Least 3 Characters")
                else setErrorCode(err.code)
            }
            else{
                setErrorCode(-1)
            }
        }
    };

    return {toRegister, error,  errorCode, resetError}
}