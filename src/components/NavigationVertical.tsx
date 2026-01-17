import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../Routes";

const NavigationVertical = () => {
  const location = useLocation();

  return (
    <ul className="nav-vertical">
      <li>
        <Link
          to={ROUTES.HOME}
          className={`nav-link-vertical ${
            location.pathname === ROUTES.HOME ? "active" : ""
          }`}
        >
          Главная
        </Link>
      </li>

      <li>
        <Link
          to={ROUTES.EXPENSES}
          className={`nav-link-vertical ${
            location.pathname.startsWith(ROUTES.EXPENSES) ? "active" : ""
          }`}
        >
          Траты
        </Link>
      </li>
    </ul>
  );
};

export default NavigationVertical;
