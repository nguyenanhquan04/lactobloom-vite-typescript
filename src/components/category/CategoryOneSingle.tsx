import { useNavigate } from "react-router-dom";
import React from "react";

interface CategoryOneSingleProps {
  data: {
    link: string;
    image: string;
    subtitle: string;
    title: string;
  };
}

const CategoryOneSingle: React.FC<CategoryOneSingleProps> = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(data.link);
  };
  return (
    <div className="collection-product-2">
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        <img src={data.image} alt="" />
      </div>
      <div className="collection-content-2 text-center">
        <span>{data.subtitle}</span>
        <h4>
          <div onClick={handleClick} style={{ cursor: "pointer" }}>
            {data.title}
          </div>
        </h4>
      </div>
    </div>
  );
};

export default CategoryOneSingle;
