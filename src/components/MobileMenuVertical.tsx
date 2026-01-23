import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "../../Routes";
import { RootState } from "../store/store";
import { logoutUser } from "../api/userApi";
import "./MobileMenuVertical.css";

const MobileMenuVertical = () => {
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
        className="mobile-menu-burger-vertical"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="burger-line-vertical"></span>
        <span className="burger-line-vertical"></span>
        <span className="burger-line-vertical"></span>
      </button>

      {isOpen && (
        <div
          className="mobile-menu-overlay-vertical"
          onClick={closeMenu}
        ></div>
      )}

      <nav className={`mobile-menu-vertical ${isOpen ? "open" : ""}`}>
        <Link
          to={ROUTES.HOME}
          className="mobile-nav-link-vertical"
          onClick={closeMenu}
        >
          Главная
        </Link>

        <Link
          to={ROUTES.EXPENSES}
          className="mobile-nav-link-vertical"
          onClick={closeMenu}
        >
          Траты
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to={ROUTES.HISTORY}
              className="mobile-nav-link-vertical"
              onClick={closeMenu}
            >
              История
            </Link>

            <Link
              to={ROUTES.PROFILE}
              className="mobile-nav-link-vertical"
              onClick={closeMenu}
            >
              Профиль
            </Link>

            <span className="mobile-username-vertical">{username}</span>

            <button
              className="mobile-nav-link-vertical logout-mobile-btn-vertical"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link
              to={ROUTES.LOGIN}
              className="mobile-nav-link-vertical"
              onClick={closeMenu}
            >
              Войти
            </Link>

            <Link
              to={ROUTES.REGISTER}
              className="mobile-nav-link-vertical"
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

export default MobileMenuVertical;
