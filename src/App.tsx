import { Suspense, lazy } from "react";
import React from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MessengerButton from "./components/messenger-button/MessengerButton";

// home pages
const Home = React.lazy(() => import("./pages/home/Home"));

// shop pages
const Shop = React.lazy(() => import("./pages/shop/Shop"));

// product pages
const Product = React.lazy(() => import("./pages/shop-product/Product"));

// blog pages
const Blog = React.lazy(() => import("./pages/blog/Blog"));
const BlogDetails = React.lazy(() => import("./pages/blog/BlogDetails"));

// other pages
const MyAccount = React.lazy(() => import("./pages/other/MyAccount"));
const Login = React.lazy(() => import("./pages/other/Login"));
const Register = React.lazy(() => import("./pages/other/Register"));
const Voucher = React.lazy(() => import("./pages/other/Voucher"));
const Cart = React.lazy(() => import("./pages/other/Cart"));
const Wishlist = React.lazy(() => import("./pages/other/Wishlist"));
const Compare = React.lazy(() => import("./pages/other/Compare"));
const Checkout = React.lazy(() => import("./pages/other/Checkout"));
const OrderHistory = React.lazy(() => import("./pages/other/OrderHistory"));
const CheckoutResult = React.lazy(() => import("./pages/other/CheckoutResult"));
const ForgotPassword = React.lazy(() => import("./pages/other/ForgotPassword"));
const Admin = React.lazy(() => import("./pages/admin/Admin"));

const NotFound = React.lazy(() => import("./pages/other/NotFound"));

const App = () => {
  return (
      <Router>
        <ScrollToTop>
          <Suspense
            fallback={
              <div className="lactobloom-preloader-wrapper">
                <div className="lactobloom-preloader">
                  <span></span>
                  <span></span>
                </div>
              </div>
            }
          >
            <Routes>
              <Route
                path={"/"}
                element={<Home />}
              />
              
              {/* Shop pages */}
              <Route
                path={"/shop"}
                element={<Shop />}
              />

              {/* Shop product pages */}
              <Route
                path={"/product/:id"}
                element={<Product />}
              />

              {/* Blog pages */}
              <Route
                path={"/blog"}
                element={<Blog />}
              />
              <Route
                path={"/blog-details/:blogId"}
                element={<BlogDetails />}
              /> 

              {/* Other pages */}
              <Route
                path={"/my-account"}
                element={<MyAccount />}
              />
              <Route
                path={"/login"}
                element={<Login />}
              />
              <Route
                path={"/register"}
                element={<Register />}
              />

              <Route
                path={"/cart"}
                element={<Cart />}
              />
              <Route
                path={"/wishlist"}
                element={<Wishlist />}
              />
              <Route
                path={"/compare"}
                element={<Compare />}
              />
              <Route
                path={"/checkout"}
                element={<Checkout />}
              />
              <Route
                path={"/voucher"}
                element={<Voucher />}
              /> 
              <Route
                path={"/order-history"}
                element={<OrderHistory />}
              />
               <Route
                path={"/checkout-result"}
                element={<CheckoutResult />}
              /> 
              <Route
                path={"/forgot-password"}
                element={<ForgotPassword />}
              /> 
              <Route
                path={"/admin"}
                element={<Admin />}
              /> 

              <Route path="*" element={<NotFound />} />
            </Routes>
            <MessengerButton />
          </Suspense>
        </ScrollToTop>
      </Router>
  );
};

export default App;