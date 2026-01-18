import defaultLogo from "../assets/fns.svg.png";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import MobileMenu from "./MobileMenu";
import { dest_img } from "../target_config";

export const TopBar = () => {
  return (
    <header className="topbar">
      <div className="logo-wrap">
        <Link to="/Nalogimain">
          <img
            src={dest_img + "/lab1/fns.svg.png"}
            alt="logo"
            className="logo-img"
            onError={(e) => {
              e.currentTarget.src = defaultLogo;
            }}
          />
        </Link>

        <div className="service-title">
          ФЕДЕРАЛЬНАЯ
          <br />
          НАЛОГОВАЯ СЛУЖБА
        </div>
      </div>

      <Navigation />
      <MobileMenu />
    </header>
  );
};
