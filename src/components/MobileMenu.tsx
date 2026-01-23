import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "../../Routes";
import { RootState } from "../store/store";
import { logoutUser } from "../api/userApi";
import "./MobileMenu.css";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const username = useSelector(
    (state: RootState) => state.user.profile?.Login
  );

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logoutUser(dispatch);
    closeMenu();
    navigate(ROUTES.EXPENSES);
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
        <Link to={ROUTES.HOME} className="mobile-nav-link" onClick={closeMenu}>
          Главная
        </Link>

        <Link to={ROUTES.EXPENSES} className="mobile-nav-link" onClick={closeMenu}>
          Траты
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to={ROUTES.HISTORY}
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              История
            </Link>

            <Link
              to={ROUTES.PROFILE}
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              Профиль
            </Link>

            <span className="mobile-username">{username}</span>

            <button
              className="mobile-nav-link logout-mobile-btn"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link
              to={ROUTES.LOGIN}
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              Войти
            </Link>

            <Link
              to={ROUTES.REGISTER}
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              Регистрация
            </Link>
          </>
        )}
      </nav>
    </>
  );
};

export default MobileMenu;
