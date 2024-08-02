import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import React from "react";

interface FooterCopyrightProps {
  footerLogo: string;
  spaceBottomClass: string;
  colorClass: string;
}

const FooterCopyright: React.FC<FooterCopyrightProps> = ({ footerLogo, spaceBottomClass, colorClass }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/")
  };

  return (   
    <div className={clsx("copyright", spaceBottomClass, colorClass)}>
      <div className="footer-logo">
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                <img src={footerLogo} alt="" />
            </div>
      </div>
      <p>
        &copy; {new Date().getFullYear()}{" "}
        <a
          href="https://www.google.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Lactobloom
        </a>
        .<br /> All Rights Reserved
      </p>
    </div>
  );
};

export default FooterCopyright;
