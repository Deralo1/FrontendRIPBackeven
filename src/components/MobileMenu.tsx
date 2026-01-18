import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes";
import "./MobileMenu.css";

const MobileMenu = () => {
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
      </nav>
    </>
  );
};

export default MobileMenu;
