import { Navigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../auth/AuthContext";
import LoginForm from "./LoginForm";
import { FocusTrap } from "focus-trap-react";
import ErrorPopup from "../../error/ErrorPopup";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/" replace />

  const {CompleteLogin, error, errorCode, resetError} = useLogin()

  
  return (
    <>
      <LoginForm
        error={error}
        CompleteLogin={CompleteLogin}
      />
      {errorCode &&
        <FocusTrap>
          <div className="ToBuyModal" aria-labelledby="BuyStockTile" role='dialog' aria-modal="true">
            <ErrorPopup 
              ErrorCode={errorCode}
              Confirm={() => {resetError()}}
              />
          </div>
        </FocusTrap>}
    </>
  );
};

export default Login;


