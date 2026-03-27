import { useAuth } from "../../../auth/AuthContext";
import { useLogout } from "../../../hooks/useLogout";

type props = {
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    menuOpen: boolean
    handleLink: (arg0: string) => void
}

export default function HeaderBurgerMenu({setMenuOpen, menuOpen, handleLink}: props){
    const { user } = useAuth();
    const logout = useLogout()
    
    const toggleMenu = () => setMenuOpen(prev => !prev);
    const MouseLeave = () => setMenuOpen(false)

    const handleLogout = () => {
        logout()
        setMenuOpen(false);
    };


    return (
        <>
            <button tabIndex={0} aria-label="Open Menu" aria-expanded={menuOpen ? "true" : "false"} className={`Header-menu ${menuOpen ? "Open" : ""}`} onClick={toggleMenu}>
                <div className={`Hamburger1 ${menuOpen ? "Open" : ""}`} ></div>
                <div className={`Hamburger2 ${menuOpen ? "Open" : ""}`} ></div>
                <div className={`Hamburger3 ${menuOpen ? "Open" : ""}`} ></div>
            </button>

            <nav data-testid="HeaderDropdown" aria-label="Menu" className={menuOpen ? "DropdownMenuOpen" : "DropdownMenuClose"} onMouseLeave={MouseLeave}>
            <ul>
                <li>
                    <button aria-label="Home Page" tabIndex={menuOpen ? 0 : -1} onClick={() => handleLink("/")}>
                        Home
                    </button>
                </li>
                <li>
                    <button aria-label="About Page" tabIndex={menuOpen ? 0 : -1} onClick={() => handleLink("/about")}>
                        About
                    </button>
                </li>
                {user && (
                <li>
                    <button aria-label="Friends Page" tabIndex={menuOpen ? 0 : -1} onClick={() => handleLink("/friends")}>
                        Friends
                    </button>
                </li>
                )}
                {user && (
                <li>
                    <button aria-label="Portfolio Page" tabIndex={menuOpen ? 0 : -1} onClick={() => handleLink("/portfolio")}>
                        Portfolio
                    </button>
                </li>
                )}
                {user && (
                <li>
                    <button aria-label="Logout Button" className="LogoutButton" tabIndex={menuOpen ? 0 : -1} onClick={handleLogout}>
                        Logout
                    </button>
                </li>
                )}
                {!user && (
                <li style={{marginTop: "0.5rem"}}>
                    <button aria-label="Login Button" onClick={() => handleLink("/login")} tabIndex={menuOpen ? 0 : -1} className="LogoutButton" style={{fontSize: "1.1rem"}}>Login</button>
                </li>
                )}
            </ul>
            </nav>
        </>
    )
}