import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "../../Routes";
import { RootState } from "../store/store";
import { logoutUser } from "../api/userApi";

const Navigation = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const username = useSelector(
    (state: RootState) => state.user.profile?.Login
  );

  const handleLogout = async () => {
    await logoutUser(dispatch);
    navigate(ROUTES.EXPENSES);
  };

  return (
    <nav className="topbar-nav">
      <Link to={ROUTES.HOME} className="nav-link">Главная</Link>
      <Link to={ROUTES.EXPENSES} className="nav-link">Траты</Link>

      {isAuthenticated ? (
        <>
          <Link to={ROUTES.HISTORY} className="nav-link">История</Link>
          <Link to={ROUTES.PROFILE} className="nav-link">Профиль</Link>

          <span className="username">{username}</span>

          <button
            onClick={handleLogout}
            className="nav-link logout-btn"
          >
            Выйти
          </button>
        </>
      ) : (
        <>
          <Link to={ROUTES.LOGIN} className="nav-link">Войти</Link>
          <Link to={ROUTES.REGISTER} className="nav-link">Регистрация</Link>
        </>
      )}
    </nav>
  );
};

export default Navigation;
