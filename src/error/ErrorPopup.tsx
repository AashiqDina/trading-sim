import "./ErrorPopup.css";
import { handleErrorMessages } from "../utils/HandleErrorMessages";
import { useLogout } from "../hooks/logout/useLogout";

type props = {
    ErrorCode: number | string | null
    Confirm: () => void
}

export default function ErrorPopup({ErrorCode, Confirm}: props ){
    const Details = handleErrorMessages(ErrorCode)
    const logout = useLogout()

    const handleAction = () => {
        if(ErrorCode === 4010) logout()
        Confirm();
    }
    
    return (
        <>
            <div className="WarningPopUp" data-testid="ErrorMessage">
                <div>
                    <div>
                        <div>
                            {Details?.warning ?
                                <img src={process.env.PUBLIC_URL + "/Warning.svg"} alt="WARNING SYMBOL" /> : <img src={process.env.PUBLIC_URL + "/Error.svg"} alt="ERROR SYMBOL" />}
                        </div>
                        <div>
                            <h2>{Details?.title}</h2>
                            <p>{Details?.bodyText}</p>
                        </div>
                    </div>
                    <div className="WarningPopUpButton">
                        <div >
                            <button aria-label="Warning Understood Confirmation" onClick={handleAction}>{Details?.buttonText}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
