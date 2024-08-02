import clsx from "clsx";
import React from "react";
import { useNavigate } from "react-router-dom";

interface BrandLogoOneSingleProps {
    data:{
      image:string;
    },
    spaceBottomClass:string;

}

const BrandLogoOneSingle: React.FC<BrandLogoOneSingleProps> = ({ data, spaceBottomClass }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(data.image);
  };
  return (
    <div className={clsx("single-brand-logo", spaceBottomClass)}>
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                <img src={data.image} alt="" />
            </div>
    </div>
  );
};

export default BrandLogoOneSingle;
