import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React from "react";

const MobileNavMenu = () => {
  const { t } = useTranslation();

  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li className="menu-item-has-children">
          <Link to={"/"}>
            {t("home")}
          </Link>
        </li>

        <li className="menu-item-has-children">
          <Link to={"/shop"}>
            {t("shop")}
          </Link>
        </li>
        <li>
          <Link to={"/contact"}>
            {t("contact_us")}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;
