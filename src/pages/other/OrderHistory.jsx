import React, { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode correctly
import { myOrders } from "../../utils/OrderHistoryService";
import { orderProducts } from "../../utils/OrderDetailService";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { cancelOrderByOrderId } from "../../utils/OrderService";

const OrderHistory = () => {
  let { pathname } = useLocation();
  let navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      if (userRole !== "MEMBER") {
        navigate("/admin");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (!token) {
      navigate("/login");
    } else {
      myOrders({
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setOrders(response.data);
          setIsEmpty(response.data.length === 0);
        })
        .catch(error => {
          console.error("There was an error fetching the order data!", error);
        });
    }
  }, [navigate]);

  const fetchOrderDetails = (orderId) => {
    const token = Cookies.get("authToken");
    orderProducts(orderId, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setOrderDetails(prevState => ({
          ...prevState,
          [orderId]: response.data
        }));
      })
      .catch(error => {
        console.error("There was an error fetching the order details!", error);
        setOrderDetails(prevState => ({
          ...prevState,
          [orderId]: null
        }));
      });
  };

  const cancelOrder = () => {
    const token = Cookies.get("authToken");
    cancelOrderByOrderId(token, orderToCancel)
      .then(response => {
        setOrders(prevOrders => prevOrders.map(order => {
          if (order.orderId === orderToCancel) {
            return { ...order, status: order.status };
          }
          return order;
        }));
        setDeleteIndex(null);
        setOrderToCancel(null);

        // Fetch the updated orders
        myOrders({
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(response => {
            setOrders(response.data);
            setIsEmpty(response.data.length === 0);
          })
          .catch(error => {
            console.error("There was an error fetching the order data!", error);
          });
      })
      .catch(error => {
        console.error("There was an error canceling the order!", error);
      });
  };

  const translateStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ xử lý";
      case "DELIVERED":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "";
      case "DELIVERED":
        return "text-success";
      case "CANCELLED":
        return "text-danger";
      default:
        return "";
    }
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const filteredOrders = selectedStatus === "ALL"
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  return (
    <Fragment>
      <SEO
        titleTemplate="Order History"
        description="Lactobloom Order History."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Trang chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            { label: "Lịch sử mua hàng", path: import.meta.env.VITE_PUBLIC_URL + pathname },
          ]}
        />
        <div className="orderhistory-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ms-auto me-auto col-lg-9">
                <div className="orderhistory-wrapper">
                  <div className="filter-status mb-4">
                    <label htmlFor="status-filter">Lọc theo trạng thái: </label>
                    <select
                      id="status-filter"
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      className="ms-2"
                    >
                      <option value="ALL">Tất cả</option>
                      <option value="PENDING">Đang chờ xử lý</option>
                      <option value="DELIVERED">Đã giao hàng</option>
                      <option value="CANCELLED">Đã hủy</option>
                    </select>
                  </div>
                  {isEmpty ? (
                    <div className="item-empty-area text-center">
                      <div className="item-empty-area__icon mb-30">
                        <i className="pe-7s-cash"></i>
                      </div>
                      <div className="item-empty-area__text">
                        Không tìm thấy lịch sử mua hàng. <br />
                        <Link to={import.meta.env.VITE_PUBLIC_URL + "/shop"}>
                          Mua ngay
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <Accordion>
                      {filteredOrders.map((order, index) => {
                        const orderDate = new Date(order.orderDate);
                        const orderDatePlus24Hours = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000);
                        const canCancel = new Date() < orderDatePlus24Hours;

                        return (
                          <Accordion.Item
                            eventKey={index.toString()}
                            key={order.orderId}
                            className="single-order-history mb-20"
                            onClick={() => fetchOrderDetails(order.orderId)}
                          >
                            <Accordion.Header className="panel-heading">
                              <div className="order-header">
                                <div className="order-header-item">
                                  {index + 1} .
                                </div>
                                <div className="order-header-item">
                                  Ngày mua:{" "}
                                  {orderDate.toLocaleDateString()}
                                </div>
                                <div className="order-header-item">|</div>
                                <div className="order-header-item">
                                  Tổng:{" "}
                                  {order.totalPrice.toLocaleString("vi-VN")} VND
                                </div>
                                <div className="order-header-item">|</div>
                                <div className={`order-header-item ${statusColor(order.status)}`}>
                                  Trạng thái: {translateStatus(order.status)}
                                </div>
                                {order.cod === false && order.status === "PENDING" && canCancel && (
                                  <div className="order-header-item">
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent accordion from toggling
                                        setDeleteIndex(index);
                                        setOrderToCancel(order.orderId);
                                      }}
                                    >
                                      Hủy
                                    </button>
                                  </div>
                                )}
                                {order.status === "PENDING" && order.cod === true && (
                                  <div className="order-header-item">
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent accordion from toggling
                                        setDeleteIndex(index);
                                        setOrderToCancel(order.orderId);
                                      }}
                                    >
                                      Hủy
                                    </button>
                                  </div>
                                )}
                              </div>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="orderhistory-info-wrapper">
                                <div className="account-info-wrapper">
                                  <h4>Thông tin đơn hàng</h4>
                                </div>
                                <div className="row">
                                  <div className="col-lg-6 col-md-6">
                                    <div className="billing-info">
                                      <label>Họ tên</label>
                                      <input
                                        type="text"
                                        value={order.fullName}
                                        disabled
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="billing-info">
                                      <label>Email</label>
                                      <input
                                        type="text"
                                        value={order.email}
                                        disabled
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="billing-info">
                                      <label>Số điện thoại</label>
                                      <input
                                        type="text"
                                        value={order.phone}
                                        disabled
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="billing-info">
                                      <label>Địa chỉ</label>
                                      <input
                                        type="text"
                                        value={order.address}
                                        disabled
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                     <div className="billing-info">
                                       <label>Phương thức thanh toán</label>
                                       <input
                                        type="text"
                                        value={order.cod ? " Thanh toán COD" : " Chuyển khoản ngân hàng"}
                                        disabled
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="billing-info">
                                      <label>Phí vận chuyển</label>
                                      <input
                                        type="text"
                                        value={(order.shippingFee === 0) ? "Miễn phí" : order.shippingFee.toLocaleString("vi-VN") + " VND"}
                                        disabled
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12">
                                    <div className="billing-info">
                                      <label>Ghi chú</label>
                                      <textarea
                                        value={order.note}
                                        disabled
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {orderDetails[order.orderId] ? (
                                      <div className="table-responsive">
                                        <table className="table">
                                          <thead>
                                            <tr>
                                            <th>Tên sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Thành tiền</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                          {orderDetails[order.orderId].map((item) => (
                                            <tr key={item.orderDetailId}>
                                              {item.preOrder ?
                                              <td>{item.productName} (Đặt trước)</td>
                                              :
                                              <td>{item.productName}</td>
                                              }
                                              <td>{item.quantity}</td>
                                              <td>{item.totalPrice.toLocaleString("vi-VN")} VND</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                        </table>
                                      </div> ) : (
                                <div>Đang tải...</div>
                              )}
                            </Accordion.Body>
                          </Accordion.Item>
                        );
                      })}
                    </Accordion>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>

      <Dialog
        open={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Hủy đơn hàng"}</DialogTitle>
        <DialogContent>
          Bạn có muốn hủy đơn hàng?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteIndex(null)} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={cancelOrder} color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default OrderHistory;
