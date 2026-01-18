import NavigationVertical from "./NavigationVertical";
import MobileMenuVertical from "./MobileMenuVertical";
import "./TopBarVertical.css";

export const TopBarVertical = () => {
  return (
    <header className="topbar-vertical">
      <div className="logo-wrap-vertical">
        <img
          src="/img-proxy/lab1/fns.svg.png"
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

      <MobileMenuVertical />
    </header>
  );
};
