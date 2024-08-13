import React from "react";
import clsx from "clsx"
import Swiper, { SwiperSlide } from "../../components/swiper/index.js";
import categoryData from "../../data/category/category-one.json";
import CategoryOneSingle from "../../components/category/CategoryOneSingle.js";

interface CategoryOneSliderProps {
  spaceBottomClass?: string;
};

// swiper slider settings
const settings = {
  loop: false,
  spaceBetween: 30,
  breakpoints: {
    320: {
      slidesPerView: 1
    },
    576: {
      slidesPerView: 2
    },
    992: {
      slidesPerView: 3
    }
  }
};

const CategoryOneSlider: React.FC<CategoryOneSliderProps> = ({ spaceBottomClass }) => {
  return (
    <div
      className={clsx("collections-area", spaceBottomClass)}
    >
      <div className="container">
        <div className="collection-wrap-2">
          <div className="collection-active-2">
            {categoryData && (
              <Swiper options={settings}>
                {categoryData.map((single, key) => (
                  <SwiperSlide key={key}>
                    <CategoryOneSingle
                      data={single}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryOneSlider;
