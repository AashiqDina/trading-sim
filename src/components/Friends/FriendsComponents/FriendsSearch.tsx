import { useEffect, useMemo, useRef, useState } from "react";
import { UserObj } from "../../../interfaces/interfaces";
import { friendListMember } from "../../../types/types";
import { useNavigate } from "react-router-dom";

type props = {
    userList: UserObj[],
    userId: number | undefined,
    friendsList: friendListMember[],
    sentReqList: friendListMember[],
    recReqList: friendListMember[],
    handleAcceptRequest: (friendId: number) => void,
    handleDeclineRequest: (friendId: number) => void,
    sendFriendRequest: (friendId: number) => void

}

export default function FriendsSearch({userList, userId, friendsList, sentReqList, recReqList, sendFriendRequest, handleAcceptRequest, handleDeclineRequest}: props){
    const navigate = useNavigate();
    
    const [input, setInput] = useState<string>("")
    const wrapperRef = useRef<HTMLDivElement>(null);

    const searchList = useMemo(() => {
        const value = input.toLowerCase();
        if (!value) return [];

        return userList.filter(user =>
            user.username.toLowerCase().includes(value)
        );
    }, [input, userList]);

    const sentIds = useMemo(() => new Set(sentReqList.map(u => u.friendsUserId)), [sentReqList]);
    const recIds = useMemo(() => new Set(recReqList.map(u => u.friendsUserId)), [recReqList]);
    const friendIds = useMemo(() => new Set(friendsList.map(u => u.friendsUserId)), [friendsList]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setInput("")
        }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <section ref={wrapperRef} className="UserFriendSearch">
            <article className='InputSection'>
                <input aria-label='Search for a friend' placeholder='Search a name... (e.g. AashiqD)' type="text"  onChange={(e) => {setInput(e.target.value)}} value={input}/>
            </article>
            {(searchList.length > 0) && (input.length > 0) && <article className='UserFriendSuggestions'>
                {searchList.map((OtherUser) => {
                    if(OtherUser.id === userId){
                    return null
                    }
                    else{
                    if(sentIds.has(OtherUser.id)){
                        return (
                        <div key={OtherUser.id}>
                            <h3>{OtherUser.username}</h3>
                            <div>
                            <h4>Pending</h4>
                            </div>
                        </div>)
                    }
                    else if(recIds.has(OtherUser.id)){
                        return (
                        <div key={OtherUser.id}>
                            <h3>{OtherUser.username}</h3>
                            <div>
                            <button aria-label={`Accept ${OtherUser.username}'s Friend Request`} onClick={() => {handleAcceptRequest(OtherUser.id)}}>Accept</button>
                            <button aria-label={`Decline ${OtherUser.username}'s Friend Request`} onClick={() => {handleDeclineRequest(OtherUser.id)}}>Decline</button>
                            </div>
                        </div>)
                    }
                    else if(friendIds.has(OtherUser.id)){
                        return (
                        <div key={OtherUser.id} onClick={() => navigate(`/portfolio/${OtherUser.username}/${OtherUser.id}`)} style={{cursor: "pointer"}}>
                            <h3>{OtherUser.username}</h3>
                            <div>
                                <h4>Friend</h4>
                            </div>
                            </div>)
                    }
                    else{
                        return (
                        <div key={OtherUser.id}>
                            <h3>{OtherUser.username}</h3>
                            <button aria-label={`Send ${OtherUser.username} a Friend Request`} onClick={() => {sendFriendRequest(OtherUser.id)}}>Add Friend</button>
                        </div>)
                    }
                    }})}
            </article>}
        </section>
    )
}