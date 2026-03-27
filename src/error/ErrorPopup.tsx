import "./Error.css";
import { handleErrorMessages } from "../utils/HandleErrorMessages";

type props = {
    ErrorCode: number | string | null
    Confirm: () => void
}

export default function ErrorPopup({ErrorCode, Confirm}: props ){

    const Details = handleErrorMessages(ErrorCode)
    
    return (
        <>
            <div className="WarningPopUp" data-testid="ErrorMessage">
                <div>
                    <div>
                        <div>
                            {Details.warning ?
                                <img src={process.env.PUBLIC_URL + "/Warning.svg"} alt="WARNING SYMBOL" /> : <img src={process.env.PUBLIC_URL + "/Error.svg"} alt="ERROR SYMBOL" />}
                        </div>
                        <div>
                            <h2>{Details.title}</h2>
                            <p>{Details.bodyText}</p>
                        </div>
                    </div>
                    <div className="WarningPopUpButton">
                        <div >
                            <button aria-label="Warning Understood Confirmation" onClick={Confirm}>{Details.buttonText}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
