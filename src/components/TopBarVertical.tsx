import NavigationVertical from "./NavigationVertical";
import "./TopBarVertical.css";

export const TopBarVertical = () => {
  return (
    <header className="topbar-vertical">
      <div className="logo-wrap-vertical">
        <img
          src="http://localhost:9000/lab1/fns.svg.png"
          alt="logo"
          className="logo-img-vertical"
        />
        <div className="service-title-vertical">
          ФЕДЕРАЛЬНАЯ<br />НАЛОГОВАЯ СЛУЖБА
        </div>
      </div>

      <nav className="topbar-nav-vertical">
        <NavigationVertical />
      </nav>
    </header>
  );
};
