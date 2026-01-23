import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "../../Routes";
import { RootState } from "../store/store";
import { logoutUser } from "../api/userApi";

const NavigationVertical = () => {
  const location = useLocation();
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

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path);

  return (
    <ul className="nav-vertical">
      <li>
        <Link
          to={ROUTES.HOME}
          className={`nav-link-vertical ${isActive(ROUTES.HOME) ? "active" : ""}`}
        >
          Главная
        </Link>
      </li>

      <li>
        <Link
          to={ROUTES.EXPENSES}
          className={`nav-link-vertical ${isActive(ROUTES.EXPENSES) ? "active" : ""}`}
        >
          Траты
        </Link>
      </li>

      {isAuthenticated && (
        <>
          <li>
            <Link
              to={ROUTES.HISTORY}
              className={`nav-link-vertical ${isActive(ROUTES.HISTORY) ? "active" : ""}`}
            >
              История
            </Link>
          </li>

          <li>
            <Link
              to={ROUTES.PROFILE}
              className={`nav-link-vertical ${isActive(ROUTES.PROFILE) ? "active" : ""}`}
            >
              Профиль
            </Link>
          </li>

          <li className="nav-vertical-username">{username}</li>

          <li>
            <button
              onClick={handleLogout}
              className="nav-link-vertical logout-btn"
            >
              Выйти
            </button>
          </li>
        </>
      )}

      {!isAuthenticated && (
        <>
          <li>
            <Link
              to={ROUTES.LOGIN}
              className={`nav-link-vertical ${isActive(ROUTES.LOGIN) ? "active" : ""}`}
            >
              Войти
            </Link>
          </li>

          <li>
            <Link
              to={ROUTES.REGISTER}
              className={`nav-link-vertical ${isActive(ROUTES.REGISTER) ? "active" : ""}`}
            >
              Регистрация
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default NavigationVertical;
