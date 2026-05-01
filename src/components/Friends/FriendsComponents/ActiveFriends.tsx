import { useNavigate } from "react-router-dom";
import { friendListMember } from "../../../types/types";
import { useState } from "react";
import DeleteFriendModal from "./DeleteFriendModal";

type props = {
    friendsList: friendListMember[]
    profitLossMap: Map<number, number>
    handleDeleteFriend: (friendId: number) => void
}

export default function ActiveFriends({friendsList, profitLossMap, handleDeleteFriend}: props){
    const navigate = useNavigate();
    const [friendToDelete, setFriendToDelete] = useState<{id: number; username: string; profitLoss: number} | null>(null)

    function cancelDeleteFriend(){ setFriendToDelete(null) } 
    
    return (
        <>
            <section className='FriendsTitle'>
                    <div></div>
                    <h2>Friends</h2>
                    <div></div>
                </section>
                <section className='FriendsList'>
                {friendsList?.map((friend: friendListMember) => {

                    const profit = profitLossMap.get(friend.friendsUserId)

                    return(
                        <article key={friend.friendsUserId} data-testid="friendInstance" onClick={() => navigate(`/portfolio/${friend.username}/${friend.friendsUserId}`)}>
                        <div className='FriendNameAndProfit'>
                            <h3>{friend.username}</h3>
                        </div>
                        <div className='plAndDeleteContainer'>
                            <p style={(profit ?? 0) < 0 ? {color: "rgba(200, 25, 25, 1)"} : {color: "rgb(69, 160, 73)"}}>{(profit ?? 0) < 0 ? "-" : "+"}£{(Math.abs(profit ?? 0)).toFixed(2)}</p>
                            <div className='DeleteButtonContainer'>
                            <button aria-label={`Remove ${friend.username} as a friend`} className='DeleteButton' onClick={(e) => {e.stopPropagation(); setFriendToDelete({id: friend.friendsUserId, username: friend.username, profitLoss: friend.profitLoss})}}>
                                <div className="CrossContainer">
                                <div className="Cross1"></div>
                                <div className="Cross2"></div>
                                </div>
                            </button>
                            </div>
                        </div>
                        </article>
                    )
                })}
                {(friendsList === null || friendsList.length === 0) && 
                    <h3>No Friends</h3>}
                </section>

            {friendToDelete && <DeleteFriendModal
                DeleteFriend={friendToDelete}
                cancelDeleteFriend={cancelDeleteFriend}
                handleDeleteFriend={handleDeleteFriend}
            />}
        </>
    )
}