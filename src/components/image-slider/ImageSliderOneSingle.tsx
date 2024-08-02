import { Link } from "react-router-dom";
import React from "react";

interface ImageSliderOneSingleProps {
  data: {
    link: string;
    image: string;
  }
}

const ImageSliderOneSingle: React.FC<ImageSliderOneSingleProps> = ({ data }) => {
  return (
    <div className="single-image">
      <Link to={data.link}>
        <img src={data.image} alt="" />
      </Link>
    </div>
  );
};

export default ImageSliderOneSingle;
