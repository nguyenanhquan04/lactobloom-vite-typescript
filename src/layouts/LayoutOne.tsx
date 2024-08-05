import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import HeaderOne from "../wrappers/header/HeaderOne";
import FooterOne from "../wrappers/footer/FooterOne";
import ScrollToTop from "../components/scroll-to-top";
import {jwtDecode} from 'jwt-decode'; // Import jwtDecode
import Cookies from 'js-cookie'; // Import js-cookie

interface LayoutOneProps {
  children?: React.ReactNode;
  headerContainerClass?: string;
  headerPaddingClass?: string;
  headerPositionClass?: string;
  headerTop?: string;
};

interface DecodedToken {
  role: string;
}

const LayoutOne: React.FC<LayoutOneProps> = ({
  children,
  headerContainerClass,
  headerTop,
  headerPaddingClass,
  headerPositionClass
}) => {
  const [isAdminOrStaff, setIsAdminOrStaff] = useState(false);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setIsAdminOrStaff(decodedToken.role === 'ADMIN' || decodedToken.role === 'STAFF');
      } catch (error) {
        console.error('Token decoding failed:', error);
        setIsAdminOrStaff(false);
      }
    }
  }, []);

  return (
    <Fragment>
      <HeaderOne
        layout={headerContainerClass}
        top={headerTop}
        headerPaddingClass={headerPaddingClass}
        headerPositionClass={headerPositionClass}
      />
      {children}
      {!isAdminOrStaff && (
        <FooterOne
          backgroundColorClass="bg-gray"
          spaceTopClass="pt-100"
          spaceBottomClass="pb-70"
        />
      )}
      <ScrollToTop/>
    </Fragment>
  );
};



export default LayoutOne;
