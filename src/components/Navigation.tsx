import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";

const Navigation = () => {
  return (
    <nav className="topbar-nav">
      <Link to={ROUTES.HOME} className="nav-link">
        Главная
      </Link>
      <Link to={ROUTES.EXPENSES} className="nav-link">
        Траты
      </Link>
    </nav>
  );
};

export default Navigation;
