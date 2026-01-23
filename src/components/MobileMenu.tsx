import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "../../Routes";
import { RootState } from "../store/store";
import { logoutUser } from "../api/userApi";
import "./MobileMenu.css";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<any>();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const username = useSelector((state: RootState) => state.user.profile?.username);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser(dispatch);
    closeMenu();
  };

  return (
    <>
      <button
        className="mobile-menu-burger"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="burger-line"></span>
        <span className="burger-line"></span>
        <span className="burger-line"></span>
      </button>

      {isOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}></div>
      )}

      <nav className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <Link
          to={ROUTES.HOME}
          className="mobile-nav-link"
          onClick={closeMenu}
        >
          Главная
        </Link>
        <Link
          to={ROUTES.EXPENSES}
          className="mobile-nav-link"
          onClick={closeMenu}
        >
          Траты
        </Link>
        
        {isAuthenticated ? (
          <>
            <span className="mobile-username">{username}</span>
            <button 
              className="mobile-nav-link logout-mobile-btn"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </>
        ) : (
          <Link
            to={ROUTES.LOGIN}
            className="mobile-nav-link login-mobile-btn"
            onClick={closeMenu}
          >
            Войти
          </Link>
        )}
      </nav>
    </>
  );
};

export default MobileMenu;
