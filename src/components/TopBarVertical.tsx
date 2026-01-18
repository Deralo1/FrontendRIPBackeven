import NavigationVertical from "./NavigationVertical";
import MobileMenuVertical from "./MobileMenuVertical";
import "./TopBarVertical.css";
import defaultLogo from "../assets/fns.svg.png";
import { dest_img } from "../target_config";

export const TopBarVertical = () => {
  return (
    <header className="topbar-vertical">
      <div className="logo-wrap-vertical">
        <img
          src={dest_img + "/lab1/fns.svg.png"}
          alt="logo"
          className="logo-img-vertical"
          onError={(e) => {
            e.currentTarget.src = defaultLogo;
          }}
        />

        <div className="service-title-vertical">
          ФЕДЕРАЛЬНАЯ
          <br />
          НАЛОГОВАЯ СЛУЖБА
        </div>
      </div>

      <nav className="topbar-nav-vertical">
        <NavigationVertical />
      </nav>

      <MobileMenuVertical />
    </header>
  );
};
