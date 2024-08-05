import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getDiscountPrice } from "../../../helpers/product";
import { deleteFromCart } from "../../../store/slices/cart-slice";
import { getImagesByProductId } from "../../../utils/ImageService";

const MenuCart: React.FC = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: any) => state.cart);
  const [cartItemsWithImages, setCartItemsWithImages] = useState([]);
  const defaultImage = "/assets/img/no-image.png"; // Default image URL
  let cartTotalPrice = 0;

  useEffect(() => {
    const fetchImagesForCartItems = async () => {
      const updatedCartItems: any = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const response = await getImagesByProductId(item.productId);
            const images = response.data.map((img) => img.imageUrl);
            return {
              ...item,
              image: images.length > 0 ? images : [defaultImage]
            };
          } catch (error) {
            console.error("Error fetching images:", error);
            return {
              ...item,
              image: [defaultImage]
            };
          }
        })
      );
      setCartItemsWithImages(updatedCartItems);
    };

    if (cartItems.length > 0) {
      fetchImagesForCartItems();
    } else {
      setCartItemsWithImages([]);
    }
  }, [cartItems]);

  return (
    <div className="shopping-cart-content">
      {cartItemsWithImages && cartItemsWithImages.length > 0 ? (
        <Fragment>
          <ul>
            {cartItemsWithImages.map((item: any) => {
              const discountedPrice = getDiscountPrice(item.price, item.discount);
              const finalProductPrice = item.price ;
              const finalDiscountedPrice = discountedPrice !== null ? discountedPrice : finalProductPrice;

              cartTotalPrice += finalDiscountedPrice * item.quantity;

              return (
                <li className="single-shopping-cart" key={item.cartItemId}>
                  <div className="shopping-cart-img">
                    <Link to={"/product/" + item.productId}>
                      <img
                        alt=""
                        src={item.image[0] || defaultImage}
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="shopping-cart-title">
                    <h4>
                      <Link to={"/product/" + item.productId}>
                        {item.productName}
                      </Link>
                    </h4>
                    <h6>SL: {item.quantity}</h6>
                    <span>
                      {discountedPrice !== null
                        ? finalDiscountedPrice.toLocaleString("vi-VN") + " VND"
                        : finalProductPrice.toLocaleString("vi-VN") + " VND"}
                    </span>
                  </div>
                  <div className="shopping-cart-delete">
                    <button onClick={() => dispatch(deleteFromCart(item.cartItemId))}>
                      <i className="fa fa-times-circle" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="shopping-cart-total">
            <h4>
              Tổng tiền :{" "}
              <span className="shop-total">
                {cartTotalPrice.toLocaleString("vi-VN") + " VND"}
              </span>
            </h4>
          </div>
          <div className="shopping-cart-btn btn-hover text-center">
            <Link className="default-btn" to={"/cart"}>
              Xem giỏ hàng
            </Link>
            <Link className="default-btn" to={"/checkout"}>
              Thanh toán
            </Link>
          </div>
        </Fragment>
      ) : (
        <p className="text-center">Không có sản phẩm trong giỏ hàng</p>
      )}
    </div>
  );
};

export default MenuCart;

