import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import React from "react";

interface NavMenuProps {
  menuWhiteClass?: string;
  sidebarMenu?: boolean;
}

const NavMenu: React.FC<NavMenuProps> = ({ menuWhiteClass, sidebarMenu }) => {
  const { t } = useTranslation();
  
  return (
    <div
      className={clsx(sidebarMenu
          ? "sidebar-menu"
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`)}
    >
      <nav>
        <ul>
          <li>
            <Link to={"/"}>
              {t("home")}             
            </Link>
          </li>
          <li>
            <Link to={"/shop"}>
              {" "}
              {t("shop")}
            </Link>
          </li>
          <li>
            <Link to={"/blog"}>
              {t("blog")}
            </Link>
          </li>
          <li>
                <Link to={"/voucher"}>
                  Mã giảm giá
                </Link>
              </li>
              <li>
                <Link to={"/about"}>
                  {t("about_us")}
                </Link>
              </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavMenu;
