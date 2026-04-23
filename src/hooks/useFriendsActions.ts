import { useState } from "react"
import AddFriend from "../api/AddFriend"
import { ApiError } from "../error/ApiError"
import AcceptFriendRequest from "../api/AcceptFriendRequest"
import DeclineFriendRequest from "../api/DeclineFriendRequest"
import DeleteFriend from "../api/DeleteFriend"

type props = {
    userId: number | undefined,
    refresh: () => void
}

export function useFriendsActions({userId, refresh}: props){
    const [actionsError, setActionsError] = useState<number | null>(null)   
    
    const resetActionError = () => {
        setActionsError(null)
    }
    
    const execute = async (action: () => Promise<void>) => {
        if (!userId) return;

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
        execute(() => AddFriend({ userId: userId!, friendId }));
    }

    async function handleAcceptRequest(friendId: number){
        execute(() => AcceptFriendRequest({ userId: userId!, friendId: friendId }))
    }

    async function handleDeclineRequest(friendId: number){
        execute(() => DeclineFriendRequest({userId: userId, friendId: friendId}))
    }

    async function handleDeleteFriend(friendId: number){
        console.log(friendId)
        execute(() => DeleteFriend({userId: userId!, friendId: friendId}))
    }

    return {actionsError, resetActionError, sendFriendRequest, handleAcceptRequest, handleDeclineRequest, handleDeleteFriend}
}