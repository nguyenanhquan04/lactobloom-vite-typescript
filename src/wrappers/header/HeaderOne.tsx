import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/header/Logo";
import NavMenu from "../../components/header/NavMenu";
import IconGroup from "../../components/header/IconGroup";
import MobileMenu from "../../components/header/MobileMenu";

interface HeaderOneProps {
  borderStyle?: string;
  headerPaddingClass?: string;
  headerPositionClass?: string;
  headerBgClass?: string;
  layout?: string;
  top?: string;
};

interface DecodedToken {
  role: string;
}

const HeaderOne: React.FC<HeaderOneProps> = ({
  layout,
  headerPaddingClass,
  headerPositionClass,
  headerBgClass
}) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  let navigate = useNavigate();

  // Check for authToken cookie and redirect to homepage if it exists
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setUserRole(decodedToken.role);
      if (decodedToken.role !== "MEMBER") {
        navigate("/admin");
      }
    }
  }, [navigate]);

  return (
    <header className={clsx("header-area clearfix", headerBgClass, headerPositionClass)}>
      <div
        className={clsx(
          headerPaddingClass, 
          "sticky-bar header-res-padding clearfix",
        )}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          <div className="row">
            <div className="col-xl-2 col-lg-2 col-md-6 col-4">
              {/* header logo */}
              <Logo imageUrl="/assets/img/logo/logo.png" logoClass="logo" />
            </div>
            <div className="col-xl-8 col-lg-8 d-none d-lg-block">
              {/* Nav menu */}
              {userRole !== "ADMIN" && userRole !== "STAFF" && <NavMenu />}
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-8">
              {/* Icon group */}
              <IconGroup />
            </div>
          </div>
        </div>
        {/* mobile menu */}
        <MobileMenu />
      </div>
    </header>
  );
};

export default HeaderOne;

