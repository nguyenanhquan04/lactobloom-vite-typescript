import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { login } from "../../utils/UserService"; // Adjust the import path as needed
import Cookies from "js-cookie"; // Import js-cookie
import { useDispatch } from "react-redux";
import { deleteAllFromCart } from "../../store/slices/cart-slice";
import { deleteAllFromWishlist } from "../../store/slices/wishlist-slice";
import {jwtDecode} from "jwt-decode";

const Login = () => {
  let dispatch = useDispatch();
  let { pathname } = useLocation();
  let navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  // Check for authToken cookie and redirect to homepage if it exists
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const decodedToken = jwtDecode<any>(token);
      const userRole = decodedToken.role;
      if (userRole !== "MEMBER") {
        navigate("/admin");
      } else {
        navigate("/"); // Redirect to homepage if role is "MEMBER"
      }
    }
  }, [navigate]);

  const handleLoginChange = (e: any) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message
    try {
      const response = await login(loginData.email, loginData.password);
      const token = response.data.token; // Adjust according to your API response
      Cookies.set("authToken", token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      }); // Store the token in a cookie
      alert("Đăng nhập thành công");
      dispatch(deleteAllFromCart());
      dispatch(deleteAllFromWishlist());
      const authToken = Cookies.get("authToken") as string;
      const decodedToken = jwtDecode<any>(authToken);
      // console.log("Login successful", response.data);
      // Navigate to a different page on successful login
      const userRole = decodedToken.role;
      console.log(userRole); // Adjust this line based on the structure of your JWT
      if (userRole !== "MEMBER") {
        navigate("/admin");
      } else {
        navigate("/"); // Redirect to homepage if role is "MEMBER"
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setErrorMessage("Username or password is incorrect or does not exist");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Đăng nhập thất bại", error);
    }
  };

  return (
    <Fragment>
      <SEO titleTemplate="Login" description="Lactobloom Đăng Nhập." />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Trang Chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            { label: "Đăng Nhập", path: import.meta.env.VITE_PUBLIC_URL + pathname },
          ]}
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Đăng Nhập</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleLoginSubmit}>
                              <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                              />
                              <input
                                type="password"
                                name="password"
                                placeholder="Mật khẩu"
                                value={loginData.password}
                                onChange={handleLoginChange}
                              />
                              {errorMessage && (
                                <div className="error-message">
                                  {errorMessage}
                                </div>
                              )}
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <Link
                                    to={
                                      import.meta.env.VITE_PUBLIC_URL +
                                      "/forgot-password"
                                    }
                                  >
                                    Quên Mật Khẩu?
                                  </Link>
                                  <Link
                                    to={import.meta.env.VITE_PUBLIC_URL + "/register"}
                                  >
                                    Đăng Ký
                                  </Link>
                                </div>
                                <button type="submit">
                                  <span>Đăng Nhập</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Login;
