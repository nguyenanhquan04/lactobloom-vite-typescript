import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import { getDiscountPrice } from "../../helpers/product";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { addToCart, decreaseQuantity, deleteFromCart, deleteAllFromCart } from "../../store/slices/cart-slice";
import { cartItemStock } from "../../helpers/product1";
import { getImagesByProductId } from "../../utils/ImageService";
import Cookies from "js-cookie"; // Import js-cookie
import {jwtDecode} from "jwt-decode"; // Update import

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  discount: number | null;
  quantity: number;
  preOrder?: boolean;
  cartItemId: string;
}

interface RootState {
  cart: {
    cartItems: CartItem[];
  };
}

const Cart: React.FC = () => {
  const [quantityCount] = useState<number>(1);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const [cartImages, setCartImages] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  // Check for authToken cookie and redirect to homepage if it exists
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const decodedToken: { role: string } = jwtDecode(token);
      const userRole = decodedToken.role;
      if (userRole !== "MEMBER") {
        navigate("/admin");
      } 
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCartImages = async () => {
      const imagesMap: { [key: string]: string } = {};
      for (const cartItem of cartItems) {
        try {
          const response = await getImagesByProductId(cartItem.productId);
          imagesMap[cartItem.productId] = response.data.length > 0 ? response.data[0].imageUrl : "/assets/img/no-image.png";
        } catch (error) {
          console.error("Error fetching images:", error);
          imagesMap[cartItem.productId] = "/assets/img/no-image.png";
        }
      }
      setCartImages(imagesMap);
    };

    if (cartItems.length > 0) {
      fetchCartImages();
    }
  }, [cartItems]);

  let cartTotalPrice = 0;

  return (
    <Fragment>
      <SEO
        titleTemplate="Cart"
        description="Lactobloom Cart Page."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            { label: "Trang Chủ", path: "/" },
            { label: "Giỏ Hàng", path: pathname }
          ]} 
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Sản phẩm trong giỏ</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Hình Ảnh</th>
                            <th>Tên Sản Phẩm</th>
                            <th>Đơn giá</th>
                            <th>Số Lượng</th>
                            <th>Thành Tiền</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((cartItem: CartItem, key: number) => {
                            const discountedPrice = getDiscountPrice(
                              cartItem.price,
                              cartItem.discount
                            );
                            const finalProductPrice = cartItem.price ;
                            const finalDiscountedPrice = discountedPrice !== null ? discountedPrice : finalProductPrice;

                            cartTotalPrice += finalDiscountedPrice * cartItem.quantity;

                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link to={`/product/${cartItem.productId}`}>
                                    <img
                                      className="img-fluid"
                                      src={cartImages[cartItem.productId] || "/assets/img/no-image.png"}
                                      alt={cartItem.productName}
                                    />
                                  </Link>
                                </td>

                                <td className="product-name">
                                  <Link to={`/product/${cartItem.productId}`}>
                                    {cartItem.productName}
                                    {cartItem.preOrder ? "(Đặt trước)" : ""}
                                  </Link>
                                </td>

                                <td className="product-price-cart">
                                  {discountedPrice !== null ? (
                                    <Fragment>
                                      <span className="amount old">
                                        {finalProductPrice.toLocaleString("vi-VN") + " VND"}
                                      </span>
                                      <br/>
                                      <span className="amount">
                                        {finalDiscountedPrice.toLocaleString("vi-VN") + " VND"}
                                      </span>
                                    </Fragment>
                                  ) : (
                                    <span className="amount">
                                      {finalProductPrice.toLocaleString("vi-VN") + " VND"}
                                    </span>
                                  )}
                                </td>

                                <td className="product-quantity">
                                  <div className="cart-plus-minus">
                                    <button
                                      className="dec qtybutton"
                                      onClick={() => dispatch(decreaseQuantity(cartItem))}
                                    >
                                      -
                                    </button>
                                    <input
                                      className="cart-plus-minus-box"
                                      type="text"
                                      value={cartItem.quantity}
                                      readOnly
                                    />
                                    <button
                                      className="inc qtybutton"
                                      onClick={() =>
                                        dispatch(addToCart({
                                          ...cartItem,
                                          quantity: quantityCount
                                        }))
                                      }
                                      disabled={
                                        cartItem !== undefined &&
                                        cartItem.quantity > 0 &&
                                        cartItem.quantity >=
                                          cartItemStock(
                                            cartItem
                                          )
                                      }
                                   >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="product-subtotal">
                                  {discountedPrice !== null
                                    ? (
                                        finalDiscountedPrice * cartItem.quantity
                                      ).toLocaleString("vi-VN") + " VND"
                                    : (
                                        finalProductPrice * cartItem.quantity
                                      ).toLocaleString("vi-VN") + " VND"}
                               </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() => dispatch(deleteFromCart(cartItem.cartItemId))}
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link to="/shop">Tiếp tục mua hàng</Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => dispatch(deleteAllFromCart())}>Xóa giỏ hàng</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-4 col-md-6"></div>

                  <div className="col-lg-4 col-md-6"></div>

                  <div className="col-lg-4 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          Tổng đơn hàng
                        </h4>
                      </div>
                      <h5>
                        Tổng tiền sản phẩm{" "}
                        <span>{cartTotalPrice.toLocaleString("vi-VN") + " VND"}</span>
                      </h5>

                      <h4 className="grand-totall-title">
                        Tổng tiền{" "}
                        <span>{cartTotalPrice.toLocaleString("vi-VN") + " VND"}</span>
                      </h4>
                      <Link to="/checkout">Thanh toán</Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      Không có sản phẩm trong giỏ hàng <br />{" "}
                      <Link to="/shop">Mua ngay</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Cart;
