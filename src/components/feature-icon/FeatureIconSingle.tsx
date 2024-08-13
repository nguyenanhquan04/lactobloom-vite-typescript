import React from "react";

interface FeatureIconSingleProps {
  singleFeature: {
    image: string;
    title: string;
    subtitle: string;
  }
}

const FeatureIconSingle: React.FC<FeatureIconSingleProps> = ({ singleFeature }) => {
  return (
    <div className="support-wrap mb-30">
      <div className="support-icon">
        <div style={{ cursor: 'pointer' }}>
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
