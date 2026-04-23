import { FocusTrap } from "focus-trap-react";

type props = {
    DeleteFriend: {
        id: number;
        username: string;
        profitLoss: number;
    } | null
    cancelDeleteFriend: () => void
    handleDeleteFriend: (friendId: number) => void
}

export default function DeleteFriendModal({DeleteFriend, cancelDeleteFriend, handleDeleteFriend}: props){

    if(!DeleteFriend) return <></>

    return (
        <FocusTrap>
            <div className="Modal">
                <div className="ModalContent">
                <h2>Are you sure you want to remove {DeleteFriend.username}?</h2>
                <div>
                </div>
                <div className="ModalFooter">
                    <button aria-label="Cancel" className="" onClick={() => {cancelDeleteFriend()}}>Cancel</button>
                    <button aria-label={`Remove ${DeleteFriend.username}`} className="" onClick={() => {handleDeleteFriend(DeleteFriend.id); cancelDeleteFriend()}}>Remove</button>
                </div>
                </div>
            </div>
        </FocusTrap>
    )
}