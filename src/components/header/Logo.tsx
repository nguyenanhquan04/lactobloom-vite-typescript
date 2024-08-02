import clsx from "clsx";
import { Link } from "react-router-dom";
import React from "react";

interface LogoProps {
  imageUrl: string;
  logoClass: string;
}

const Logo: React.FC<LogoProps> = ({ imageUrl, logoClass }) => {
  return (
    <div className={clsx(logoClass)}>
      <Link to={"/"}>
        <img alt="" src={imageUrl} />
      </Link>
    </div>
  );
};

export default Logo;
