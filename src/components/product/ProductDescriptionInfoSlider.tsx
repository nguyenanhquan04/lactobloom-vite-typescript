import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../store/contexts/cart-context";  // Sử dụng Context
import Rating from "./sub-components/ProductRating";
import { useWishlist } from "../../store/contexts/wishlist-context";
import { useCompare } from "../../store/contexts/compare-context";

interface ProductDescriptionInfoSliderProps {
  discountedPrice: number;
  finalDiscountedPrice: number;
  finalProductPrice: number;
  product: {
    productName: string;
    rating: number;
    description: string;
    stock: number;
    category: any[];
  };
  wishlistItem: any;
  compareItem: any;
}

const ProductDescriptionInfoSlider: React.FC<ProductDescriptionInfoSliderProps> = ({
  product,
  discountedPrice,
  finalDiscountedPrice,
  finalProductPrice,
  wishlistItem,
  compareItem,
}) => {
  const { cartItemsState, addToCart } = useCart();  // Sử dụng context
  const { addToWishlist} = useWishlist();
  const { addToCompare } = useCompare();

  const { cartItems } = cartItemsState;
  const [quantityCount, setQuantityCount] = useState(1);

  const productCartQty = cartItems.find((item: any) => item.productId === product.productId)?.quantity || 0;

  return (
    <div className="product-details-content pro-details-slider-content">
      <h2>{product.productName}</h2>
      <div className="product-details-price justify-content-center">
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
      {product.rating && product.rating > 0 ? (
        <div className="pro-details-rating-wrap justify-content-center">
          <div className="pro-details-rating mr-0">
            <Rating ratingValue={product.rating} />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="pro-details-list">
        <p>{product.description}</p>
      </div>

      <div className="pro-details-quality justify-content-center">
        <div className="cart-plus-minus">
          <button
            onClick={() =>
              setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
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
            onClick={() =>
              setQuantityCount(
                quantityCount < product.stock - productCartQty
                  ? quantityCount + 1
                  : quantityCount
              )
            }
            className="inc qtybutton"
          >
            +
          </button>
        </div>
        <div className="pro-details-cart btn-hover">
          {product.stock && product.stock > 0 ? (
            <button
              onClick={() =>
                addToCart({
                  ...product,
                  quantity: quantityCount,
                })
              }
              disabled={productCartQty >= product.stock}
            >
              {" "}
              Thêm vào Giỏ{" "}
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
            onClick={() => addToWishlist(product)}
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
            onClick={() => addToCompare(product)}
          >
            <i className="pe-7s-shuffle" />
          </button>
        </div>
      </div>
      {product.category ? (
        <div className="pro-details-meta justify-content-center">
          <span>Danh mục :</span>
          <ul>
            {product.category.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={"/shop"}>{single}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )}

      <div className="pro-details-social">
        <ul className="justify-content-center">
          <li>
            <a href="//facebook.com">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="//dribbble.com">
              <i className="fa fa-dribbble" />
            </a>
          </li>
          <li>
            <a href="//pinterest.com">
              <i className="fa fa-pinterest-p" />
            </a>
          </li>
          <li>
            <a href="//twitter.com">
              <i className="fa fa-twitter" />
            </a>
          </li>
          <li>
            <a href="//linkedin.com">
              <i className="fa fa-linkedin" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDescriptionInfoSlider;
