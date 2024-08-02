import React, { Fragment, useEffect } from "react"; 
import { useLocation, useNavigate } from "react-router-dom"; 
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import SectionTitleWithText from "../../components/section-title/SectionTitleWithText";
import BannerOne from "../../wrappers/banner/BannerOne";
import TextGridOne from "../../wrappers/text-grid/TextGridOne";
import FunFactOne from "../../wrappers/fun-fact/FunFactOne";
import TeamMemberOne from "../../wrappers/team-member/TeamMemberOne";
import BrandLogoSliderOne from "../../wrappers/brand-logo/BrandLogoSliderOne";
import Cookies from "js-cookie"; // Import js-cookie
import {jwtDecode} from "jwt-decode";

const About: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  // Check for authToken cookie and redirect to homepage if it exists
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const decodedToken: { role: string } = jwtDecode(token);
      const userRole = decodedToken.role;
      if (userRole !== "MEMBER") {
        navigate("/admin");
      } 
    }
  }, [navigate]);

  return (
    <Fragment>
      <SEO
        titleTemplate="About us"
        description="Lactobloom About Us Page."
      /> 
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            { label: "Home", path: "/" },
            { label: "About us", path: pathname }
          ]} 
        />

        {/* section title with text */}
        <SectionTitleWithText spaceTopClass="pt-100" spaceBottomClass="pb-95" />

        {/* banner */}
        <BannerOne spaceBottomClass="pb-70" />

        {/* text grid */}
        <TextGridOne spaceBottomClass="pb-70" />

        {/* fun fact */}
        <FunFactOne
          spaceTopClass="pt-100"
          spaceBottomClass="pb-70"
          bgClass="bg-gray-3"
        />

        {/* team member */}
        <TeamMemberOne spaceTopClass="pt-95" spaceBottomClass="pb-70" />

        {/* brand logo slider */}
        <BrandLogoSliderOne spaceBottomClass="pb-70" />
      </LayoutOne>
    </Fragment>
  );
};

export default About;

