import { Link } from "react-router-dom";
import React from "react";

const HeroSliderOneSingle = () => {
  return (
    <div className="single-slider slider-height-1 bg-purple">
      <div className="container">
        <div className="row justify-content-center align-items-center text-center">
        <div className="col-xl-12 col-lg-12 col-md-12 col-12 col-sm-12">
            <div className="slider-content slider-animated-1">
              <h3 className="animated">Chào mừng đến với</h3>
              <h1 className="animated">LactoBloom Store</h1>
              <div className="slider-btn btn-hover">
                <Link
                  className="animated"
                  to={"/shop"}
                >
                  KHÁM PHÁ NGAY
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSliderOneSingle;
