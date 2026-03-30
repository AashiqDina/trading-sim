import "./Register.css";
import { useRegister } from "../../hooks/useRegister";
import RegisterForm from "./RegisterForm";
import { FocusTrap } from "focus-trap-react";
import ErrorPopup from "../../error/ErrorPopup";

function Register() {

  const {toRegister, error,  errorCode, resetError} = useRegister()

  
  return (
    <>
      <RegisterForm
        error={error}
        CompleteRegister={toRegister}
      />
      {errorCode &&
        <FocusTrap>
          <div className="ToBuyModal" aria-labelledby="RegistrationError" role='dialog' aria-modal="true">
            <ErrorPopup 
              ErrorCode={errorCode}
              Confirm={() => {resetError()}}
              />
          </div>
        </FocusTrap>}
    </>
  )  
}

export default Register;




