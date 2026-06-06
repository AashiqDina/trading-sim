import "./Register.css";
import { useRegister } from "../../hooks/register/useRegister";
import RegisterForm from "./RegisterForm";
import { FocusTrap } from "focus-trap-react";
import ErrorPopup from "../../error/ErrorPopup";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Loading from "../Loading/Loading";

function Register() {
  const { user } = useAuth();

  const {toRegister, loading, error,  errorCode, resetError} = useRegister()

  if(user) return <Navigate to="/" replace />
  if(loading) return <Loading/>
  
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




