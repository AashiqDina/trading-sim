import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import handleLogin from "../api/handleLogin";
import { ApiError } from "../error/ApiError";

export function useLogin() {
    const [error, setError] = useState<string>("");
    const [errorCode, setErrorCode] = useState<number | null>(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const resetError = () => {
        setError("");
        setErrorCode(null);
    };

    const CompleteLogin = async (username: string, password: string) => {
        setError("")
        try {
        const data = await handleLogin(username, password);

        login({
            id: data.user.id,
            username: data.user.username,
            investedAmount: data.user.investedAmount,
            currentValue: data.user.currentValue,
            profitLoss: data.user.profitLoss,
        });

        navigate("/portfolio");

        } catch (err) {
        if (err instanceof ApiError) {
            if (err.code === 401) {
            setError("Invalid Username or Password");
            } else {
            setErrorCode(err.code);
            }
        } else {
            setErrorCode(-1);
        }
        }
    };

    return { CompleteLogin, error, errorCode, resetError };
}