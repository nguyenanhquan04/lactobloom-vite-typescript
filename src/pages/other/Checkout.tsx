import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { myVoucher } from "../../utils/VoucherService";
import { userInfo } from "../../utils/UserService";
import { createPayment } from "../../utils/PaymentService";
import Cookies from "js-cookie"; // Import js-cookie
import { jwtDecode } from "jwt-decode";

const Checkout = () => {
  let cartTotalPrice = 0;

  let { pathname } = useLocation();

  const { cartItems } = useSelector((state: any) => state.cart);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState<any | null>(null);
  const authToken = Cookies.get("authToken");

  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderNotes, setOrderNotes] = useState(""); // Đã thêm state for order notes
  const [errors, setErrors] = useState<any>({});
  const [shippingMethod, setShippingMethod] = useState();

  let navigate = useNavigate();

  // Check for authToken cookie and redirect to homepage if it exists
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const decodedToken = jwtDecode<any>(token);
      const userRole = decodedToken.role;
      if (userRole !== "MEMBER") {
        navigate("/admin");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await myVoucher({
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, [authToken]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userInfo();
        setUser(response.data);
        setFullName(response.data.fullName);
        setAddress(response.data.address);
        setEmail(response.data.email);
        setPhone(response.data.phone);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleVoucherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoucherId = event.target.value;
    const selectedVoucher =
      vouchers.find(
        (voucher: any) => voucher.voucherId === parseInt(selectedVoucherId)
      ) || null; // Default to null if no voucher is found

    setSelectedVoucher(selectedVoucher);
  };

  if (selectedVoucher) {
    const discountAmount = (cartTotalPrice * selectedVoucher.discount) / 100;
    cartTotalPrice -= discountAmount;
  }

  const validateForm = () => {
    const newErrors = {} as any;
    if (!fullName) newErrors.fullName = "Họ tên là bắt buộc";
    if (!address) newErrors.address = "Địa chỉ là bắt buộc";
    if (!email) newErrors.email = "Email là bắt buộc";
    if (!phone) newErrors.phone = "Số điện thoại là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = async (amount: number) => {
    if (!validateForm()) {
      return;
    }

    let finalAmount = amount;
    let discountAmount = 0;

    if (selectedVoucher) {
      discountAmount = (amount * selectedVoucher.discount) / 100;
      finalAmount = amount - discountAmount;
    }

    const orderInfo = {
      cartItems,
      fullName,
      address,
      email,
      phone,
      totalAmount: finalAmount,
      discountAmount, // Include discount amount
      transactionTime: new Date().toLocaleString(),
      orderNotes,
      selectedVoucher,
      cod: shippingMethod,
    };

    // Save order information to localStorage
    localStorage.setItem("orderInfo", JSON.stringify(orderInfo));

    if (shippingMethod === true) {
      navigate("/checkout-result");
      return;
    }

    try {
      const response = await createPayment(finalAmount);
      const { status, message, url } = response.data;
      if (status === "OK") {
        window.location.href = url; // Redirect to the payment URL
      } else {
        console.error("Failed to create payment:", message);
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  return (
    <Fragment>
      <SEO titleTemplate="Checkout" description="Lactobloom Checkout Page." />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Trang Chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            {
              label: "Thanh toán",
              path: import.meta.env.VITE_PUBLIC_URL + pathname,
            },
          ]}
        />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <div className="row">
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>Thông tin đặt hàng</h3>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Họ tên</label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                          />
                          {errors.fullName && (
                            <div className="error-text">{errors.fullName}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Địa chỉ</label>
                          <input
                            className="billing-address"
                            placeholder="House number and street name"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                          />
                          {errors.address && (
                            <div className="error-text">{errors.address}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Email</label>
                          <input
                            className="billing-address"
                            placeholder="abc@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          {errors.email && (
                            <div className="error-text">{errors.email}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Số điện thoại</label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                          {errors.phone && (
                            <div className="error-text">{errors.phone}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Voucher</label>
                          <select onChange={handleVoucherChange}>
                            <option value="">Chọn voucher</option>
                            {vouchers.map((voucher: any) => (
                              <option
                                key={voucher.voucherId}
                                value={voucher.voucherId}
                              >
                                Giảm {voucher.discount}%, Ngày hết hạn:{" "}
                                {voucher.expirationDate}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="additional-info-wrap">
                      <h4>Thông tin thêm</h4>
                      <div className="additional-info">
                        <label>Ghi chú</label>
                        <textarea
                          name="message"
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)} // Handle order notes change
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>Đơn hàng của bạn</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>Sản phẩm</li>
                            <li>Thành tiền</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem: any, key: any) => {
                              console.log(cartItems);
                              const discountedPrice = getDiscountPrice(
                                cartItem.price,
                                cartItem.discount
                              );
                              const finalProductPrice = cartItem.price;
                              const finalDiscountedPrice =
                                discountedPrice as number;

                              discountedPrice != null
                                ? (cartTotalPrice +=
                                    finalDiscountedPrice *
                                    cartItem.quantity).toLocaleString("vi-VN")
                                : (cartTotalPrice +=
                                    finalProductPrice *
                                    cartItem.quantity).toLocaleString("vi-VN");
                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {cartItem.preOrder &&
                                    cartItem.stock > 0 &&
                                    authToken ? (
                                      <>
                                        {cartItem.productName} {"(Đặt trước)"} X{" "}
                                        {cartItem.quantity}
                                      </>
                                    ) : (
                                      <>
                                        {cartItem.productName} X{" "}
                                        {cartItem.quantity}
                                      </>
                                    )}
                                  </span>{" "}
                                  <span className="order-price">
                                    {discountedPrice !== null
                                      ? (
                                          finalDiscountedPrice *
                                          cartItem.quantity
                                        ).toLocaleString("vi-VN") + " VND"
                                      : (
                                          finalProductPrice * cartItem.quantity
                                        ).toLocaleString("vi-VN") + " VND"}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Vận chuyển</li>
                            <li>Miễn phí</li>
                          </ul>
                          {selectedVoucher && (
                            <div className="your-order-discount">
                              <ul>
                                <li className="order-discount">Giảm giá</li>
                                <li>
                                  {(cartTotalPrice-(getDiscountPrice(cartTotalPrice, selectedVoucher.discount) as number)).toLocaleString("vi-VN") + " VND"}
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Tổng</li>
                            <li>
                              {selectedVoucher
                                ? (getDiscountPrice(cartTotalPrice, selectedVoucher.discount) as number).toLocaleString("vi-VN") + " VND"
                                : cartTotalPrice.toLocaleString("vi-VN") +
                                  " VND"}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="payment-method">
                        <ul>Phương thức thanh toán</ul>
                        <select
                          value={shippingMethod}
                          onChange={(e) =>
                            setShippingMethod(JSON.parse(e.target.value))
                          }
                          required
                        >
                          <option value="false">Chuyển khoản ngân hàng</option>
                          <option value="true">Thanh toán COD</option>
                        </select>
                      </div>
                    </div>
                    <div className="place-order mt-25">
                      <button
                        className="btn-hover"
                        onClick={() => placeOrder(cartTotalPrice)}
                      >
                        Hoàn tất đơn hàng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      Không tìm thấy mặt hàng <br />{" "}
                      <Link to={import.meta.env.VITE_PUBLIC_URL + "/shop"}>
                        Mua Ngay
                      </Link>
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

export default Checkout;
