import React, { Fragment, useState, useEffect } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Rating from "./sub-components/ProductRating";
import { getDiscountPrice } from "../../helpers/product";
import ProductModal from "./ProductModal";
import { getImagesByProductId } from "../../utils/ImageService";
import Cookies from "js-cookie";
import { myWishlist, saveWishlist } from "../../utils/WishlistService";
import { useWishlist } from "../../store/contexts/wishlist-context";
import { useCart } from "../../store/contexts/cart-context";


interface ProductGridSingleProps {
  cartItem?: any,
  compareItem?: any,
  wishlistItem?: any,
  product?: any,
  sliderClassName?: string,
  spaceBottomClass?: string,
};

const ProductGridSingle: React.FC<ProductGridSingleProps> = ({
  product,
  cartItem,
  wishlistItem,
  compareItem,
  spaceBottomClass
}) => {
  const { addToWishlist, wishlistItemsState } = useWishlist();
  const { addToCart, cartItemsState } = useCart();

  const {wishlistItems} = wishlistItemsState;
  const {cartItems} = cartItemsState;

  const [modalShow, setModalShow] = useState(false);
  const [productImages, setProductImages] = useState("/assets/img/no-image.png");
  const [isProductInWishlist, setIsProductInWishlist] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const discountedPrice = getDiscountPrice(product.price, product.discount) as number;
  const finalProductPrice = +(product.price * 1);
  const finalDiscountedPrice = +(
    discountedPrice * 1
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const response = await getImagesByProductId(product.productId);
        setProductImages(response.data[0].imageUrl);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    const fetchWishlistData = async () => {
      try {
        const token = Cookies.get("authToken") || null;
        setAuthToken(token);
        if (token) {
          const response = await myWishlist(token);
          const wishlistData = response.data;
          setIsProductInWishlist(wishlistItems.some((item: any) => item.productId === product.productId));
        }
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
      }
    };

    fetchProductImages();
    fetchWishlistData();
  }, [product.productId]);

  const handleWishlistClick = async () => {
    if (authToken) {
      try {
        await saveWishlist(authToken, product.productId);
        addToWishlist(product);
        setIsProductInWishlist(true);
      } catch (error) {
        console.error("Error saving to wishlist:", error);
      }
    } else {
      addToWishlist(product);
      setIsProductInWishlist(true);
    }
  };

  return (
    <Fragment>
      <div className={clsx("product-wrap", spaceBottomClass)}>
        <div className="product-img">
          <Link to={"/product/" + product.productId}>
            <img
              className="default-img"
              src={productImages}
              alt={product.productName}
            />
          </Link>
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

          <div className="product-action">
            <div className="pro-same-action pro-wishlist">
              <button
                className={isProductInWishlist ? "active" : ""}
                disabled={isProductInWishlist}
                title={
                  isProductInWishlist
                    ? "Đã thêm vào yêu thích"
                    : "Thêm vào yêu thích"
                }
                onClick={handleWishlistClick}
              >
                <i className="pe-7s-like" />
              </button>
            </div>
            <div className="pro-same-action pro-cart">
              {product.preOrder === false && product.stock && product.stock > 0 ? (
                <button
                  onClick={() => addToCart(product)}
                  className={
                    cartItem !== undefined && cartItem.quantity > 0
                      ? "active"
                      : ""
                  }
                  disabled={cartItem !== undefined && cartItem.quantity > 0}
                  title={
                    cartItem !== undefined ? "Đã thêm vào giỏ hàng" : "Thêm vào giỏ"
                  }
                >
                  {" "}
                  <i className="pe-7s-cart"></i>{" "}
                  {cartItem !== undefined && cartItem.quantity > 0
                    ? "Đã thêm"
                    : "Thêm vào giỏ"}
                </button>
              ) : product.stock > 0 && product.preOrder && authToken ? (
                <button
                  onClick={() => addToCart(product)}
                  className={
                    cartItem !== undefined && cartItem.quantity > 0
                      ? "active"
                      : ""
                  }
                  disabled={cartItem !== undefined && cartItem.quantity > 0}
                  title={
                    cartItem !== undefined ? "Đã thêm vào giỏ hàng" : "Đặt trước"
                  }
                >
                  {" "}
                  <i className="pe-7s-cart"></i>{" "}
                  {cartItem !== undefined && cartItem.quantity > 0
                    ? "Đã thêm"
                    : "Đặt trước"}
                </button>
              ) : (
                <button disabled className="active">
                  Hết hàng
                </button>
              )}
            </div>
            <div className="pro-same-action pro-quickview">
              <button onClick={() => setModalShow(true)} title="Quick View">
                <i className="pe-7s-look" />
              </button>
            </div>
          </div>
        </div>
        <div className="product-content text-center">
          {(product.stock <= 0 && product.preOrder && authToken) ?
          <h3>
            <Link to={"/product/" + product.productId}>
              {product.productName}{" "}(Pre Order)
            </Link> 
          </h3>
          :
          <h3>
            <Link to={"/product/" + product.productId}>
              {product.productName}
            </Link>
          </h3>}
          {product.rating && product.rating > 0 ? (
            <div className="product-rating">
              <Rating ratingValue={product.rating} />
            </div>
          ) : (
            ""
          )}
          <div className="product-price">
            {discountedPrice !== null ? (
              <Fragment>
                <span>{finalDiscountedPrice.toLocaleString("vi-VN") + " VND"}</span>{" "}
                <span className="old">
                  {finalProductPrice.toLocaleString("vi-VN") + " VND"}
                </span>
              </Fragment>
            ) : (
              <span>{finalProductPrice.toLocaleString("vi-VN") + " VND"} </span>
            )}
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        discountedPrice={discountedPrice}
        finalProductPrice={finalProductPrice}
        finalDiscountedPrice={finalDiscountedPrice}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
      />
    </Fragment>
  );
};


export default ProductGridSingle;
