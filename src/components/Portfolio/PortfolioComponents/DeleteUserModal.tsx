import { FocusTrap } from "focus-trap-react"
import "./DeleteUserModal.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../../hooks/logout/useLogout";

type props = {
    cancelDelete: () => void,
    handleDeleteUser: (Confirmation: boolean) => Promise<boolean>

}

export default function DeleteUserModal({cancelDelete, handleDeleteUser}: props){
    const navigate = useNavigate();
    const logout = useLogout()
    const [input, setInput] = useState("")

    const handleDeleteConfirm = async () => {
        try {
            const result = await handleDeleteUser(input==="DELETE ACCOUNT")
            if(result){
                navigate(`/`)
                logout()
            }
            
        } catch (error) {
            console.log("error handled in del function") 
        }
    }


    return (
        <FocusTrap>
            <div>
                <div className="Modal">
                    <div className="UserDeleteModalContent">
                        <h2>Type "DELETE ACCOUNT" exactly to delete your account?</h2>

                        <div>
                            <input className="DeleteConfirmInput" type="text" placeholder="DELETE ACCOUNT" onChange={(e) => {setInput(e.target.value)}}/>
                        </div>

                        <div className="ModalFooter">
                            <button aria-label='Cancel?' className="" onClick={() => {
                                cancelDelete()
                            }}>Cancel</button>
                            <button aria-label='Delete Stock?' className="DeleteAccountButton" onClick={handleDeleteConfirm}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </FocusTrap>
    )
}