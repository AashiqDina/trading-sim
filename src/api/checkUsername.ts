import { ApiError } from "../error/ApiError";

export default async function checkUsername(username: string){
    try{
        const checkResponse = await fetch("https://tradingsim-backend.onrender.com/api/User/checkUsername", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });

          if (!checkResponse.ok) {
            throw new ApiError(1002); // Error Checking Usernmae Availabilty
        }

        const checkData = await checkResponse.json();
        if (checkData.exists) {
            throw new ApiError(1003); // Username already taken.
        }
    }
    catch(err){
        if(err instanceof ApiError){
            throw err
        }

        throw new ApiError(-1)
        
    }
    
} 