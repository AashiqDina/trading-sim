import { useCallback, useEffect, useState } from "react"
import { UserObj } from "../../interfaces/interfaces"
import { ApiError } from "../../error/ApiError"
import getAllUsers from "../../api/getAllUsers"
import getFriends from "../../api/getFriends"
import { friendListMember } from "../../types/types"
import getSentRequests from "../../api/getSentRequests"
import getReceivedRequests from "../../api/getReceivedRequests"

type props = {
    userId: number | undefined
}


export function useFriends({userId}: props){
    const [userList, setUserList] = useState<UserObj[]>([])
    const [profitLossMap, setProfitLossMap] = useState<Map<number, number>>(new Map());
    const [friendsList, setFriendsList] = useState<friendListMember[]>([])
    const [sentReqList, setSentReqList] = useState<friendListMember[]>([])
    const [recReqList, setRecReqList] = useState<friendListMember[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setErrorCode] = useState<number | null>(null)

    const resetError = () => {
        setErrorCode(null)
    }

    const getData = useCallback(async () => {
        try {
            if(!userId) return
            
            setLoading(true)

            const [allUserList, usersFriendsList, sentRequests, receivedRequests] = await Promise.all([
                getAllUsers(),
                getFriends(),
                getSentRequests({userId}),
                getReceivedRequests({userId})
            ])   
            const ProfitLosses = new Map<number, number>()
            allUserList.forEach((user: UserObj) => {
                ProfitLosses.set(user.id, user.profitLoss);
            });
            setProfitLossMap(ProfitLosses)
            setUserList(allUserList)
            setFriendsList(usersFriendsList)
            setSentReqList(sentRequests)
            setRecReqList(receivedRequests)
                
        } 
        catch (err) {
            if(err instanceof ApiError) setErrorCode(err.code)
            else setErrorCode(-1)
        }
        finally{
            setLoading(false)
        }
    }, [userId])

    const refresh = () => {
        getData()
    }

    useEffect(() => {
        if (!userId) return;
        getData();
    }, [userId, getData]);

    return {loading, error, userList, profitLossMap, friendsList, sentReqList, recReqList, refresh, resetError}
}