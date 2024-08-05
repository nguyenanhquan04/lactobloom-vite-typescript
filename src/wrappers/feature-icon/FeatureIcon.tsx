import PropTypes from "prop-types";
import clsx from "clsx";
import featureIconData from "../../data/feature-icons/feature-icon.json";
import FeatureIconSingle from "../../components/feature-icon/FeatureIconSingle";
import React from "react";

interface FeatureIconProps{
  spaceBottomClass: string;
  spaceTopClass: string;
};

const FeatureIcon: React.FC<FeatureIconProps> = ({ spaceTopClass, spaceBottomClass }) => {
  return (
    <div className={clsx("support-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="row">
          {featureIconData?.map(singleFeature => (
            <div className="col-lg-3 col-sm-6" key={singleFeature.id}>
              <FeatureIconSingle
                singleFeature={singleFeature}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureIcon;
