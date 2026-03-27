import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import "./Header.css";
import { useAuth} from "../../auth/AuthContext";
import Logo from "../Logo/Logo"
import HomeBurgerMenu from "./HeaderComponents/HomeBurgerMenu";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false); 
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLink = (page: string) => {
    setMenuOpen(false);
    navigate(page);
  };

  return ( 
    <header id="Top" className="Header">

       <HomeBurgerMenu
        setMenuOpen={setMenuOpen}
        menuOpen={menuOpen}
        handleLink={handleLink}
       />

        <button aria-label="Home Page" className="Header-logo" onClick={() => handleLink("/")}>
            <Logo/>
        </button>

        {user ? (
          <button tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLink("/portfolio")}} aria-label="Click here to visit your portfolio" className="HeaderUsername" onClick={() => handleLink("/portfolio")}>{user.username}</button>
        ) : (
          <button aria-label="Login Button" className="Header-logo" onClick={() => handleLink("/login")} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLink("/login")}}><img src={process.env.PUBLIC_URL + '/UserIcon.png'} alt="Icon for a user that is not logged in" className="UserIcon" /></button>
        )}  

    </header>
  );
};

export default Header;


