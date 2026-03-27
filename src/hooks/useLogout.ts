import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

export function useLogout(){
    const { logout } = useAuth();
    const navigate = useNavigate();
  
    return () => {
        logout(); 
        navigate("/login");
    };

}