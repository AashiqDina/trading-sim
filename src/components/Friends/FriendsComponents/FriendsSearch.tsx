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
    sendFriendRequest: (friendId: number) => void

}

export default function FriendsSearch({userList, userId, friendsList, sentReqList, recReqList, sendFriendRequest}: props){
    const navigate = useNavigate();
    
    const [input, setInput] = useState<string>("")
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const searchList = useMemo(() => {
        const value = input.toLowerCase();
        if (!value) return [];

        return userList.filter(user =>
            user.username.toLowerCase().includes(value) && user.id != userId
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

    const arrowNav = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            suggestionRefs.current[index + 1]?.focus();
        } 
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            if(index === 0) {
                inputRef.current?.focus(); 
            } 
            else {
                suggestionRefs.current[index - 1]?.focus();
            }
        }
    }

    return (
        <section ref={wrapperRef} className="UserFriendSearch">
            <article className='InputSection'>
                <input 
                    aria-label='Search for a friend' 
                    placeholder='Search a name... (e.g. AashiqD)' 
                    type="text"  
                    ref={inputRef}
                    onChange={(e) => {setInput(e.target.value)}} 
                    value={input}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            if(suggestionRefs.current[0]) suggestionRefs.current[0].focus();
                        }}}
                    />
            </article>
            {(searchList.length > 0) && (input.length > 0) && <article className='UserFriendSuggestions' data-testid="FriendSearchSuggestions">
                {searchList.map((OtherUser, index) => {
                    if(sentIds.has(OtherUser.id)){
                        return (
                        <button 
                          key={OtherUser.id}
                          onKeyDown={(e) => {arrowNav(e, index)}}
                          ref={(e) => {suggestionRefs.current[index] = e;}}
                          >
                            <h3>{OtherUser.username}</h3>
                            <div>
                            <h4>Pending</h4>
                            </div>
                        </button>)
                    }
                    else if(recIds.has(OtherUser.id)){
                        return (
                        <button 
                          key={OtherUser.id}
                          onKeyDown={(e) => {arrowNav(e, index)}}
                          ref={(e) => {suggestionRefs.current[index] = e;}}
                        >
                            <h3>{OtherUser.username}</h3>
                            <h4>Pending Accept/Decline</h4>

                        </button>)
                    }
                    else if(friendIds.has(OtherUser.id)){
                        return (
                        <button 
                          onKeyDown={(e) => {arrowNav(e, index)}}
                          key={OtherUser.id} 
                          onClick={() => navigate(`/portfolio/${OtherUser.username}/${OtherUser.id}`)} 
                          style={{cursor: "pointer"}} 
                          data-testid="FriendForSearchSugg"
                          ref={(e) => {suggestionRefs.current[index] = e;}}
                          >
                            <h3>{OtherUser.username}</h3>
                            <div>
                                <h4>Friend</h4>
                            </div>
                        </button>)
                    }
                    else{
                        return (
                        <button 
                          key={OtherUser.id} 
                          onKeyDown={(e) => {arrowNav(e, index)}}
                          ref={(e) => {suggestionRefs.current[index] = e;}}
                          >
                            <h3>{OtherUser.username}</h3>
                            <button aria-label={`Send ${OtherUser.username} a Friend Request`} onClick={() => {sendFriendRequest(OtherUser.id)}}>Add Friend</button>
                        </button>)
                    }
                    })}
            </article>}
        </section>
    )
}