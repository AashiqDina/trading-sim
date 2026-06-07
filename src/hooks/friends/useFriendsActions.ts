import { useState } from "react"
import AddFriend from "../../api/AddFriend"
import { ApiError } from "../../error/ApiError"
import AcceptFriendRequest from "../../api/AcceptFriendRequest"
import DeclineFriendRequest from "../../api/DeclineFriendRequest"
import DeleteFriend from "../../api/DeleteFriend"

type props = {
    refresh: () => void
}

export function useFriendsActions({refresh}: props){
    const [actionsError, setActionsError] = useState<number | null>(null)   
    
    const resetActionError = () => {
        setActionsError(null)
    }
    
    const execute = async (action: () => Promise<void>) => {
        try{
            await action();
            refresh();
        }
        catch (err){
            if (err instanceof ApiError) setActionsError(err.code);
            else setActionsError(-1);
        }
    };

    async function sendFriendRequest(friendId: number){
        execute(() => AddFriend({ friendId }));
    }

    async function handleAcceptRequest(friendId: number){
        execute(() => AcceptFriendRequest({ friendId: friendId }))
    }

    async function handleDeclineRequest(friendId: number){
        execute(() => DeclineFriendRequest({friendId: friendId}))
    }

    async function handleDeleteFriend(friendId: number){
        console.log(friendId)
        execute(() => DeleteFriend({friendId: friendId}))
    }

    return {actionsError, resetActionError, sendFriendRequest, handleAcceptRequest, handleDeclineRequest, handleDeleteFriend}
}