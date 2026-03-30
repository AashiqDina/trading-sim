import { ApiError } from "../error/ApiError";

export default async function handleRegister(username: string, password: string){    

    try {
        const response = await fetch("https://tradingsim-backend.onrender.com/api/User", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            username,
            password,
            }),
        });

        const data = await response.json();


        if(!response.ok || !data.success) throw new ApiError(-1) 

    } 
    catch (err) {
        if(err instanceof ApiError){
            throw err
        }

        throw new ApiError(-1)
    }
}