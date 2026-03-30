import { ApiError } from "../error/ApiError";


export default async function handleLogin(username: string, password: string){

    
    try{
        const response = await fetch("https://tradingsim-backend.onrender.com/api/User/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                username,
                password,
                }),
            });

        const data = await response.json();

        if(!response.ok) throw new ApiError(response.status)
        
        return data

    }
    catch(err){
        if(err instanceof ApiError) throw err

        throw new ApiError(0)
    }
}