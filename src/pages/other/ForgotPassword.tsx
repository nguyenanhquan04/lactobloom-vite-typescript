import React, { Fragment, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Cookies from "js-cookie"; // Import js-cookie
import {jwtDecode} from "jwt-decode";
import { changePassword, verifyEmail } from "../../utils/OtpService";

const ForgotPassword = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    reenterPassword: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
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
    const token = Cookies.get('authToken');
    if (token) {
      navigate("/"); // Redirect to homepage
    }
  }, [navigate]);

  useEffect(() => {
    let timer: number = 0;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (timer) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const response = await verifyEmail(formData.email);
      if (response.status === 200) {
        setOtpSent(true);
        setCountdown(60);
        setErrorMessage("");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setErrorMessage("Email does not exist or server is temporarily unavailable");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.reenterPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await changePassword(formData.email, Number(formData.otp), 
        {
          password: formData.password,
          repeatPassword: formData.reenterPassword
        }
      )

      if (response.status === 200) {
        setSuccessMessage("Password successfully changed! Back to login in 5s.");
        setErrorMessage("");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        setErrorMessage("Invalid OTP or password mismatch.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Forgot Password"
        description="Lactobloom Forgot Password Page."
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Trang Chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            {
              label: "Quên Mật Khẩu",
              path: import.meta.env.VITE_PUBLIC_URL + pathname,
            },
          ]}
        />
        <div className="forgot-password-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="forgot-password-wrapper">
                  <Tab.Container defaultActiveKey="forgot-password">
                    <Nav variant="pills" className="forgot-password-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="forgot-password">
                          <h4>Quên Mật Khẩu</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="forgot-password">
                        <div className="forgot-password-container">
                          <form onSubmit={handleSubmit}>
                            <div className="email-otp-container">
                              <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                              />
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading || countdown > 0}
                                className="send-otp-button"
                              >
                                {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi OTP"}
                              </button>
                            </div>
                            {otpSent && (
                              <>
                                <input
                                  type="text"
                                  name="otp"
                                  placeholder="OTP"
                                  value={formData.otp}
                                  onChange={handleChange}
                                  required
                                />
                                <input
                                  type="password"
                                  name="password"
                                  placeholder="Mật khẩu mới"
                                  value={formData.password}
                                  onChange={handleChange}
                                  required
                                />
                                <input
                                  type="password"
                                  name="reenterPassword"
                                  placeholder="Nhập lại mật khẩu mới"
                                  value={formData.reenterPassword}
                                  onChange={handleChange}
                                  required
                                />
                              </>
                            )}
                            {!loading && errorMessage && (
                              <div className="error-message">{errorMessage}</div>
                            )}
                            {loading && countdown === 0 && (
                              <div className="loading-animation">
                                {/* Replace this div with your actual loading animation */}
                                Đang chờ...
                              </div>
                            )}
                            {otpSent && (
                              <div className="button-box">
                                <button type="submit" disabled={loading}>
                                  <span>OK</span>
                                </button>
                              </div>
                            )}
                            {successMessage && (
                              <div className="success-message">{successMessage}</div>
                            )}
                          </form>
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

export default ForgotPassword;
