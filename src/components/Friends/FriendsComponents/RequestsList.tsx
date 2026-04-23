import { friendListMember } from "../../../types/types"

type props = {
    recReqList: friendListMember[]
    sentReqList: friendListMember[]
    handleAcceptRequest: (friendId: number) => void
    handleDeclineRequest: (friendId: number) => void
}


export default function RequestsList({recReqList, sentReqList, handleAcceptRequest, handleDeclineRequest}: props){

    return (
        <>
           <section className='FriendsTitle'>
                <div></div>
                <h2>Requests</h2>
                <div></div>
            </section>
            <section className='FriendRequestsList'>
              {recReqList?.map((FriendRequest: friendListMember) => (
                <article key={"Received-Requests" + FriendRequest.friendsUserId}>
                  <h3>{FriendRequest.username}</h3>
                  <div>
                    <button aria-label={`Accept ${FriendRequest.username}'s Friend Request`} onClick={() => {handleAcceptRequest(FriendRequest.friendsUserId)}}>Accept</button>
                    <button aria-label={`Decline ${FriendRequest.username}'s Friend Request`} onClick={() => {handleDeclineRequest(FriendRequest.friendsUserId)}}>Decline</button>
                  </div>
                </article>
              ))}
              {sentReqList?.map((FriendRequest: friendListMember) => (
                <article key={"Sent-Requests" + FriendRequest.friendsUserId}>
                  <h3>{FriendRequest.username}</h3>
                    <h4>Pending</h4>
                </article>
              ))}
            </section> 
        </>
    )
}