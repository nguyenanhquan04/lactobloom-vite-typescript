import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { EffectFade, Thumbs } from 'swiper';
import AnotherLightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Swiper, { SwiperSlide } from "../swiper";
import { getImagesByProductId } from "../../utils/ImageService";

const ProductImageGallery = ({ product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [index, setIndex] = useState(-1);
  const [images, setImages] = useState([]);

  const defaultImage = "/assets/img/no-image.png";

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getImagesByProductId(product.productId);
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    if (product?.productId) {
      fetchImages();
    }
  }, [product?.productId]);

  const slides = images.length ? images.map((img, i) => ({
    src: img.imageUrl,
    key: i,
  })) : [{ src: defaultImage, key: 0 }];

  // swiper slider settings
  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    thumbs: { swiper: thumbsSwiper },
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: true,
  };

  return (
    <Fragment>
      <div className="product-large-image-wrapper">
        {product.discount || product.new ? (
          <div className="product-img-badges">
            {product.discount ? (
              <span className="pink">-{product.discount}%</span>
            ) : (
              ""
            )}
            {product.new ? <span className="purple">New</span> : ""}
          </div>
        ) : (
          ""
        )}
        {images.length ? (
          <Swiper options={gallerySwiperParams}>
            {images.map((single, key) => (
              <SwiperSlide key={key}>
                <button className="lightgallery-button" onClick={() => setIndex(key)}>
                  <i className="pe-7s-expand1"></i>
                </button>
                <div className="single-image">
                  <img
                    src={single.imageUrl}
                    className="img-fluid"
                    alt=""
                  />
                </div>
              </SwiperSlide>
            ))}
            <AnotherLightbox
              open={index >= 0}
              index={index}
              close={() => setIndex(-1)}
              slides={slides}
              plugins={[Thumbnails, Zoom, Fullscreen]}
            />
          </Swiper>
        ) : null}
      </div>
      <div className="product-small-image-wrapper mt-15">
        {images.length ? (
          <Swiper options={thumbnailSwiperParams}>
            {images.map((single, key) => (
              <SwiperSlide key={key}>
                <div className="single-image">
                  <img
                    src={single.imageUrl}
                    className="img-fluid"
                    alt=""
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
      </div>
    </Fragment>
  );
};

ProductImageGallery.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.number.isRequired,
    discount: PropTypes.number,
    new: PropTypes.bool,
  }),
};

export default ProductImageGallery;