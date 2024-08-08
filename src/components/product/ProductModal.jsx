import { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { EffectFade, Thumbs } from "swiper";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Rating from "./sub-components/ProductRating";
import Swiper, { SwiperSlide } from "../../components/swiper";
import { getProductCartQuantity } from "../../helpers/product";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";
import Cookies from "js-cookie";

import { getProductReviewByProductId } from "../../utils/ProductReviewService";
import { getCategoryByProductId } from "../../utils/CategoryService";
import { getBrandByProductId } from "../../utils/BrandService";
import { myWishlist, saveWishlist } from "../../utils/WishlistService";
import { getImagesByProductId } from "../../utils/ImageService";

function ProductModal({
  product,
  discountedPrice,
  finalProductPrice,
  finalDiscountedPrice,
  show,
  onHide,
  wishlistItem,
  compareItem,
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const [quantityCount, setQuantityCount] = useState(1);
  const productCartQty = getProductCartQuantity(cartItems, product);

  const [averageRating, setAverageRating] = useState(0);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [images, setImages] = useState([]);
  const [isProductInWishlist, setIsProductInWishlist] = useState(false);
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    getProductReviewByProductId(product.productId)
      .then((response) => {
        const reviews = response.data;
        const totalRating = reviews.reduce(
          (acc, review) => acc + review.rate,
          0
        );
        const avgRating = reviews.length ? totalRating / reviews.length : 0;
        setAverageRating(avgRating);
      })
      .catch((error) => {
        console.error("Error fetching the reviews:", error);
      });

    getCategoryByProductId(product.productId)
      .then((response) => {
        setCategory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the category:", error);
      });

    getBrandByProductId(product.productId)
      .then((response) => {
        setBrand(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the brand:", error);
      });

    if (authToken) {
      myWishlist(authToken)
        .then((response) => {
          const wishlistData = response.data;
          setIsProductInWishlist(
            wishlistData.some((item) => item.productId === product.productId)
          );
        })
        .catch((error) => {
          console.error("Error fetching wishlist data:", error);
        });
    }

    // Fetch images from the API
    getImagesByProductId(product.productId)
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product images:", error);
      });
  }, [product.productId, authToken]);

  const handleWishlistClick = async () => {
    if (authToken) {
      try {
        await saveWishlist(authToken, product.productId);
        dispatch(addToWishlist(product));
        setIsProductInWishlist(true);
      } catch (error) {
        console.error("Error saving to wishlist:", error);
      }
    } else {
      dispatch(addToWishlist(product));
      setIsProductInWishlist(true);
    }
  };

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

  const onCloseModal = () => {
    setThumbsSwiper(null);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onCloseModal}
      className="product-quickview-modal-wrapper"
    >
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body">
        <div className="row">
          <div className="col-md-5 col-sm-12 col-xs-12">
            <div className="product-large-image-wrapper">
              <Swiper options={gallerySwiperParams}>
                {images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="single-image">
                      <img
                        src={img.imageUrl}
                        className="img-fluid"
                        alt="Product"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="product-small-image-wrapper mt-15">
              <Swiper options={thumbnailSwiperParams}>
                {images.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="single-image">
                      <img src={img.imageUrl} className="img-fluid" alt="" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="col-md-7 col-sm-12 col-xs-12">
            <div className="product-details-content quickview-content">
              {product.stock > 0 && product.preOrder && authToken ? (
                <h2>{product.productName} (Đặt trước)</h2>
              ) : (
                <h2>{product.productName}</h2>
              )}
              <div className="product-details-price">
                {discountedPrice !== null ? (
                  <Fragment>
                    <span>
                      {(finalDiscountedPrice || 0).toLocaleString("vi-VN") +
                        " VND"}
                    </span>{" "}
                    <span className="old">
                      {(finalProductPrice || 0).toLocaleString("vi-VN") +
                        " VND"}
                    </span>
                  </Fragment>
                ) : (
                  <span>
                    {(finalProductPrice || 0).toLocaleString("vi-VN") + " VND"}{" "}
                  </span>
                )}
              </div>
              {averageRating && averageRating > 0 ? (
                <div className="pro-details-rating-wrap">
                  <div className="pro-details-rating">
                    <Rating ratingValue={averageRating} />
                  </div>
                  <span>({averageRating.toFixed(1)} / 5)</span>
                </div>
              ) : (
                <div className="pro-details-rating-wrap">
                  <div className="pro-details-rating">
                    <Rating ratingValue={0} />
                  </div>
                  <span>(0 / 5)</span>
                </div>
              )}
              <div className="pro-details-list">
                <p>{product.description}</p>
              </div>
              <div className="pro-details-quality">
                <div className="cart-plus-minus">
                  <button
                    onClick={() =>
                      setQuantityCount(
                        quantityCount > 1 ? quantityCount - 1 : 1
                      )
                    }
                    className="dec qtybutton"
                  >
                    -
                  </button>
                  <input
                    className="cart-plus-minus-box"
                    type="text"
                    value={quantityCount}
                    readOnly
                  />
                  <button
                    onClick={() => {
                      setQuantityCount(
                        quantityCount < product.stock - productCartQty
                          ? quantityCount + 1
                          : quantityCount
                      );
                    }}
                    className="inc qtybutton"
                  >
                    +
                  </button>
                </div>
                <div className="pro-details-cart btn-hover">
                  {product.stock &&
                  product.stock > 0 &&
                  product.preOrder === false ? (
                    <button
                      onClick={() =>
                        dispatch(
                          addToCart({
                            ...product,
                            quantity: quantityCount,
                          })
                        )
                      }
                      disabled={productCartQty >= product.stock}
                    >
                      Thêm vào giỏ
                    </button>
                  ) : product.stock > 0 && product.preOrder && authToken ? (
                    <button
                      onClick={() =>
                        dispatch(
                          addToCart({
                            ...product,
                            quantity: quantityCount,
                            preOrder: true,
                          })
                        )
                      }
                      disabled={productCartQty >= product.stock}
                    >
                      Đặt trước
                    </button>
                  ) : (
                    <button disabled>Hết hàng</button>
                  )}
                </div>
                <div className="pro-details-wishlist">
                  <button
                    className={wishlistItem !== undefined ? "active" : ""}
                    disabled={wishlistItem !== undefined}
                    title={
                      wishlistItem !== undefined
                        ? "Đã thêm vào yêu thích"
                        : "Thêm vào yêu thích"
                    }
                    onClick={handleWishlistClick}
                  >
                    <i className="pe-7s-like" />
                  </button>
                </div>
                <div className="pro-details-compare">
                  <button
                    className={compareItem !== undefined ? "active" : ""}
                    disabled={compareItem !== undefined}
                    title={
                      compareItem !== undefined
                        ? "Đã thêm vào so sánh"
                        : "Thêm vào so sánh"
                    }
                    onClick={() => dispatch(addToCompare(product))}
                  >
                    <i className="pe-7s-shuffle" />
                  </button>
                </div>
              </div>
              {category && (
                <div className="pro-details-category">
                  <span>Danh mục: <Link>{category.categoryName}</Link></span>
                </div>
              )}
              {brand && (
                <div className="pro-details-category">
                  <span>Thương hiệu: <Link>{brand.brandName}</Link></span>
                </div>
              )}
              <div className="pro-details-social">
                <ul>
                  <li>
                    <a href="https://www.facebook.com">
                      <i className="fa fa-facebook" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.twitter.com">
                      <i className="fa fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com">
                      <i className="fa fa-instagram" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.google.com">
                      <i className="fa fa-google-plus" />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com">
                      <i className="fa fa-linkedin" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

ProductModal.propTypes = {
  product: PropTypes.object,
  discountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  show: PropTypes.bool,
  onHide: PropTypes.func,
  wishlistItem: PropTypes.object,
  compareItem: PropTypes.object,
};

export default ProductModal;
