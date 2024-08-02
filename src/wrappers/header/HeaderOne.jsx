// import PropTypes from "prop-types";
// import clsx from "clsx";
// import Logo from "../../components/header/Logo";
// import NavMenu from "../../components/header/NavMenu";
// import IconGroup from "../../components/header/IconGroup";
// import MobileMenu from "../../components/header/MobileMenu";

// const HeaderOne = ({
//   layout,
//   headerPaddingClass,
//   headerPositionClass,
//   headerBgClass
// }) => {
//   return (
//     <header className={clsx("header-area clearfix", headerBgClass, headerPositionClass)}>
//       <div
//         className={clsx(
//           headerPaddingClass, 
//           "sticky-bar header-res-padding clearfix",
//         )}
//       >
//         <div className={layout === "container-fluid" ? layout : "container"}>
//           <div className="row">
//             <div className="col-xl-2 col-lg-2 col-md-6 col-4">
//               {/* header logo */}
//               <Logo imageUrl="/assets/img/logo/logo.png" logoClass="logo" />
//             </div>
//             <div className="col-xl-8 col-lg-8 d-none d-lg-block">
//               {/* Nav menu */}
//               <NavMenu />
//             </div>
//             <div className="col-xl-2 col-lg-2 col-md-6 col-8">
//               {/* Icon group */}
//               <IconGroup />
//             </div>
//           </div>
//         </div>
//         {/* mobile menu */}
//         <MobileMenu />
//       </div>
//     </header>
//   );
// };

// HeaderOne.propTypes = {
//   borderStyle: PropTypes.string,
//   headerPaddingClass: PropTypes.string,
//   headerPositionClass: PropTypes.string,
//   layout: PropTypes.string,
//   top: PropTypes.string
// };

// export default HeaderOne;

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/header/Logo";
import NavMenu from "../../components/header/NavMenu";
import IconGroup from "../../components/header/IconGroup";
import MobileMenu from "../../components/header/MobileMenu";


const HeaderOne = ({
  layout,
  headerPaddingClass,
  headerPositionClass,
  headerBgClass
}) => {
  const [userRole, setUserRole] = useState(null);
  let navigate = useNavigate();

  // Check for authToken cookie and redirect to homepage if it exists
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
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

HeaderOne.propTypes = {
  borderStyle: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  layout: PropTypes.string,
  top: PropTypes.string
};

export default HeaderOne;

