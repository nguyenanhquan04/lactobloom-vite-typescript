import Swiper, { SwiperSlide } from "../swiper";

interface ProductImageGallerySliderProps {
  product?: any;
}

const ProductImageGallerySlider: React.FC<ProductImageGallerySliderProps> = ({ product }) => {
  // swiper slider settings
  const gallerySwiperParams = {
    spaceBetween: 15,
    slidesPerView: 3,
    loop: true,
    navigation: true,
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      640: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 2
      },
      1024: {
        slidesPerView: 3
      }
    }
  };
  return (
    <div className="product-large-image-wrapper product-large-image-wrapper--slider">
      {product?.image?.length ? (
        <Swiper options={gallerySwiperParams}>
          {product.image.map((single: any, key: any) => (
            <SwiperSlide key={key}>
              <div className="single-image">
                <img
                  src={import.meta.env.VITE_PUBLIC_URL + single}
                  className="img-fluid"
                  alt=""
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ): null}
    </div>
  );
};


export default ProductImageGallerySlider;