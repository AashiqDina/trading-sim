import './Friends.css'
import { FocusTrap } from 'focus-trap-react';
import '../../interfaces/interfaces'
import { useAuth } from '../../auth/AuthContext';
import Loading from '../Loading/Loading';
import { useFriends } from '../../hooks/useFriends';
import { useFriendsActions } from '../../hooks/useFriendsActions';
import FriendsSearch from './FriendsComponents/FriendsSearch';
import ActiveFriends from './FriendsComponents/ActiveFriends';
import RequestsList from './FriendsComponents/RequestsList';
import ErrorPopup from '../../error/ErrorPopup';

export default function Friends(){
  const { user } = useAuth();

  const {loading, error, userList, friendsList, profitLossMap, sentReqList, recReqList, refresh, resetError} = useFriends({userId: user?.id})
  const {actionsError, resetActionError, sendFriendRequest, handleAcceptRequest, handleDeclineRequest, handleDeleteFriend} = useFriendsActions({userId: user?.id, refresh})

  if(loading) return ( <Loading/> )

  if(error) return (
    <FocusTrap>
      <ErrorPopup 
        ErrorCode={error}
        Confirm={resetError}
      />
    </FocusTrap>
  )

  return(
      <>
        <FriendsSearch 
          userList={userList} 
          userId={user?.id} 
          friendsList={friendsList} 
          sentReqList={sentReqList}
          recReqList={recReqList}
          sendFriendRequest={sendFriendRequest}
        />

        <ActiveFriends
          friendsList={friendsList}
          profitLossMap={profitLossMap}
          handleDeleteFriend={handleDeleteFriend}
        />

        {(recReqList?.length > 0 || sentReqList?.length > 0) && 
          <RequestsList
            recReqList={recReqList}
            sentReqList={sentReqList}
            handleAcceptRequest={handleAcceptRequest}
            handleDeclineRequest={handleDeclineRequest}
          />
        }

        {actionsError &&
          <FocusTrap>
              <ErrorPopup 
                ErrorCode={actionsError}
                Confirm={resetActionError}
              />
          </FocusTrap>
        }
      </>
    )
}