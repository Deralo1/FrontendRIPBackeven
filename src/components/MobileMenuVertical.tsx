import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import "./MobileMenuVertical.css";

const MobileMenuVertical = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
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
        <div className="mobile-menu-overlay-vertical" onClick={closeMenu}></div>
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
      </nav>
    </>
  );
};

export default MobileMenuVertical;
