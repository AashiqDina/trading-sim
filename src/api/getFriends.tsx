import axios from "axios";
import { ApiError } from "../error/ApiError";
import { friendListMember } from "../types/types";

export default async function getFriends(): Promise<friendListMember[]> {

  try{
    const token = localStorage.getItem("token");
    const result = await axios.get(
        "https://tradingsim-backend.onrender.com/api/User/Get-Friends", {
        headers: {
            Authorization: `Bearer ${token}`
        }
      }
    );
    if (result.data.hasError) throw new ApiError(result.data.errorCode);
    return result.data.data;
  }
  catch(error){
    if (error instanceof ApiError) throw error;
    if (axios.isAxiosError(error)) {
        if(error.response?.status === 401) throw new ApiError(4010)
        throw new ApiError(error.response?.status ?? -1);
    }

    throw new ApiError(-1);
  }
}