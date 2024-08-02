import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import clsx from "clsx";

import Swiper, { SwiperSlide } from "../../components/swiper";
import SectionTitle from "../../components/section-title/SectionTitle";
import ProductGridSingle from "../../components/product/ProductGridSingle";
import { get4RandomProducts } from "../../utils/ProductService";

const settings = {
  loop: false,
  slidesPerView: 4,
  grabCursor: true,
  spaceBetween: 30,
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  },
};

const RelatedProductSlider = ({ spaceBottomClass }) => {
  const [randomProducts, setRandomProducts] = useState([]);
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const response = await get4RandomProducts();
        setRandomProducts(response.data);
      } catch (error) {
        console.error("Error fetching random products", error);
      }
    };

    fetchRandomProducts();
  }, []);

  return (
    <div className={clsx("related-product-area", spaceBottomClass)}>
      <div className="container">
        <SectionTitle
          titleText="Sản Phẩm Đề Xuất"
          positionClass="text-center"
          spaceClass="mb-50"
        />
        {randomProducts.length ? (
          <Swiper options={settings}>
            {randomProducts.map((product) => (
              <SwiperSlide key={product.productId}>
                <ProductGridSingle
                  product={product}
                  currency={currency}
                  cartItem={cartItems.find(
                    (cartItem) => cartItem.productId === product.productId
                  )}
                  wishlistItem={wishlistItems.find(
                    (wishlistItem) => wishlistItem.productId === product.productId
                  )}
                  compareItem={compareItems.find(
                    (compareItem) => compareItem.productId === product.productId
                  )}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
      </div>
    </div>
  );
};

RelatedProductSlider.propTypes = {
  spaceBottomClass: PropTypes.string,
};

export default RelatedProductSlider;
