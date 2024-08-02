import React from "react";
import { useNavigate } from "react-router-dom";

interface FeatureIconSingleProps {
  singleFeature: {
    image: string;
    title: string;
    subtitle: string;
  }
}

const FeatureIconSingle: React.FC<FeatureIconSingleProps> = ({ singleFeature }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(singleFeature.image)
  };
  return (
    <div className="support-wrap mb-30">
      <div className="support-icon">
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                <img className="animated" src={singleFeature.image} alt="" />
            </div>
      </div>
      <div className="support-content">
        <h5>{singleFeature.title}</h5>
        <p>{singleFeature.subtitle}</p>
      </div>
    </div>
  );
};

export default FeatureIconSingle;
