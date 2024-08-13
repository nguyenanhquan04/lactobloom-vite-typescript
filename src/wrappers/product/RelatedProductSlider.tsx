import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Swiper, { SwiperSlide } from "../../components/swiper";
import SectionTitle from "../../components/section-title/SectionTitle";
import ProductGridSingle from "../../components/product/ProductGridSingle";
import { get4RandomProducts } from "../../utils/ProductService";
import { useCart } from "../../store/contexts/cart-context";
import { useWishlist } from "../../store/contexts/wishlist-context";
import { useCompare } from "../../store/contexts/compare-context";

interface RelatedProductSliderProps {
  spaceBottomClass?: string;
};

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

const RelatedProductSlider: React.FC<RelatedProductSliderProps> = ({ spaceBottomClass }) => {
  const [randomProducts, setRandomProducts] = useState([]);
  const {cartItemsState} = useCart();
  const { wishlistItemsState} = useWishlist();
  const {compareItemsState} = useCompare();

  const { cartItems } = cartItemsState;
  const { wishlistItems } = wishlistItemsState;
  const { compareItems } = compareItemsState;

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
            {randomProducts.map((product: any) => (
              <SwiperSlide key={product.productId}>
                <ProductGridSingle
                  product={product}
                  cartItem={cartItems.find(
                    (cartItem: any) => cartItem.productId === product.productId
                  )}
                  wishlistItem={wishlistItems.find(
                    (wishlistItem: any) => wishlistItem.productId === product.productId
                  )}
                  compareItem={compareItems.find(
                    (compareItem: any) => compareItem.productId === product.productId
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

export default RelatedProductSlider;
