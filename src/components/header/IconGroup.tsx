import PropTypes, { string } from "prop-types";
import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import MenuCart from "./sub-components/MenuCart";
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode'; 
import { logOut, userInfo } from "../../utils/UserService";
import { deleteAllFromCart } from "../../store/slices/cart-slice";
import { deleteAllFromWishlist } from "../../store/slices/wishlist-slice";

interface IconGroupProps {
  iconWhiteClass?: string;
}

interface CustomJwtPayload {
  role: string;
}


const IconGroup: React.FC<IconGroupProps> = ({ iconWhiteClass }) => {
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector("#offcanvas-mobile-menu") as HTMLElement;
    if (offcanvasMobileMenu) {
      offcanvasMobileMenu.classList.add("active");
  }
  };

  const { compareItems } = useSelector((state: any) => state.compare);
  const { wishlistItems } = useSelector((state: any) => state.wishlist);
  const { cartItems } = useSelector((state: any) => state.cart);

  const [authToken, setAuthToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const token = Cookies.get('authToken');
    setAuthToken(token);
    if (token) {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        setIsAdmin(decodedToken.role === 'ADMIN' || decodedToken.role === 'STAFF');
        fetchUserInfo(token); // Fetch user info if token is present
      } catch (error) {
        console.error('Token decoding failed:', error);
        setIsAdmin(false);
      }
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      const response = await userInfo(token);
      setFullName(response.data.fullName);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmLogout) {
      logOut(Cookies.get('authToken'));
      Cookies.remove('authToken'); 
      dispatch(deleteAllFromCart());
      dispatch(deleteAllFromWishlist());
    }
  };

  return (
    <div className={clsx("header-right-wrap", iconWhiteClass)}>
      {!isAdmin && (
        <>
          <div className="same-style header-compare">
            <Link to={"/compare"}>
              <i className="pe-7s-shuffle" />
              <span className="count-style">
                {compareItems && compareItems.length ? compareItems.length : 0}
              </span>
            </Link>
          </div>
          <div className="same-style header-wishlist">
            <Link to={"/wishlist"}>
              <i className="pe-7s-like" />
              <span className="count-style">
                {wishlistItems && wishlistItems.length ? wishlistItems.length : 0}
              </span>
            </Link>
          </div>
          <div className="same-style cart-wrap d-none d-lg-block">
            <button className="icon-cart" onClick={(e) => handleClick(e)}>
              <i className="pe-7s-shopbag" />
              <span className="count-style">
                {cartItems && cartItems.length ? cartItems.length : 0}
              </span>
            </button>
            <MenuCart />
          </div>
          <div className="same-style cart-wrap d-block d-lg-none">
            <Link className="icon-cart" to={"/cart"}>
              <i className="pe-7s-shopbag" />
              <span className="count-style">
                {cartItems && cartItems.length ? cartItems.length : 0}
              </span>
            </Link>
          </div>
        </>
      )}
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className="account-setting-active"
          onClick={(e) => handleClick(e)}
        >
          <i className="pe-7s-user-female" />
        </button>
        <div className="account-dropdown">
          <ul>
            {!authToken ? (
              <>
                <li>
                  <Link to={"/login"}>Đăng Nhập</Link>
                </li>
                <li>
                  <Link to={"/register"}>
                    Đăng ký
                  </Link>
                </li>
              </>
            ) : (
              <>
              {authToken && (
                <h5>
                  Xin Chào, {fullName}
                </h5>
              )}
                {isAdmin && (
                  <li>
                    <Link to={"/admin"}>
                      Trang quản lý
                    </Link>
                  </li>
                )}
                {!isAdmin && (
                  <>
                    <li>
                      <Link to={"/my-account"}>
                        Tài khoản
                      </Link>
                    </li>
                    <li>
                      <Link to={"/order-history"}>
                        Lịch sử mua
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link onClick={handleLogout} to="/login">
                    Đăng xuất
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

export default IconGroup;
