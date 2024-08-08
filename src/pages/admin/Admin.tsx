import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode correctly
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import ProductManagement from "./ProductManagement";
import UserManagement from "./UserManagement";
import BlogManagement from "./BlogManagement";
import BrandManagement from "./BrandManagement";
import CategoryManagement from "./CategoryManagement";
import OrderManagement from "./OrderManagement";
import Dashboard from "./Dashboard";
import VoucherManagement from "./VoucherManagement";
import BlogCategoryManagement from "./BlogCategoryManagement";

const Sidebar = ({ onSelect, role }) => {
  let navigate = useNavigate();
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false); // State for product submenu
  const [isBlogMenuOpen, setIsBlogMenuOpen] = useState(false); // State for blog submenu

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (!token || role === "MEMBER") {
      navigate("/login");
    } 
  }, [navigate]);

  const toggleProductMenu = () => {
    setIsProductMenuOpen(!isProductMenuOpen); // Toggle product submenu
  };

  const toggleBlogMenu = () => {
    setIsBlogMenuOpen(!isBlogMenuOpen); // Toggle blog submenu
  };

  return (
    <div className="col-lg-2">
      <div className="sidebar">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to = "#" className="sidebar-link" onClick={() => onSelect("dashboard")}>
              Biểu đồ
            </Link>
          </li>
          <li className="nav-item">
            <Link to = "#" className="sidebar-link" onClick={toggleProductMenu}>
              Quản lý sản phẩm
              <FontAwesomeIcon 
                icon={isProductMenuOpen ? faChevronUp : faChevronDown} 
                className={`dropdown-icon ${isProductMenuOpen ? 'rotate' : ''}`} 
              />
            </Link>
            {isProductMenuOpen && (
              <ul className="nav flex-column submenu">
                <li className="nav-item">
                  <Link to = "#" className="sidebar-link" onClick={() => onSelect("product")}>
                    Sản phẩm
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to = "#" className="sidebar-link" onClick={() => onSelect("category")}>
                    Danh mục
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to = "#" className="sidebar-link" onClick={() => onSelect("brand")}>
                    Thương hiệu
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item">
            <Link to = "#" className="sidebar-link" onClick={toggleBlogMenu}>
              Quản lý bài viết
              <FontAwesomeIcon 
                icon={isBlogMenuOpen ? faChevronUp : faChevronDown} 
                className={`dropdown-icon ${isBlogMenuOpen ? 'rotate' : ''}`} 
              />
            </Link>
            {isBlogMenuOpen && (
              <ul className="nav flex-column submenu">
                <li className="nav-item">
                  <Link to = "#" className="sidebar-link" onClick={() => onSelect("blog")}>
                    Bài Viết
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to = "#" className="sidebar-link" onClick={() => onSelect("blog-category")}>
                    Danh mục
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item">
            <Link to = "#" className="sidebar-link" onClick={() => onSelect("order")}>
              Quản lý đơn hàng
            </Link>
          </li>
          <li className="nav-item">
            <Link to = "#" className="sidebar-link" onClick={() => onSelect("voucher")}>
              Quản lý Voucher
            </Link>
          </li>
          {role === "ADMIN" && (
            <li className="nav-item">
              <Link to = "#" className="sidebar-link" onClick={() => onSelect("user")}>
                Quản lý người dùng
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

const Admin = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("dashboard"); // Default selection
  const [role, setRole] = useState(""); // State to store user role

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const decodedToken = jwtDecode<any>(token);
      setRole(decodedToken.role); // Set the user role
      if (decodedToken.role === "MEMBER") {
        navigate("/"); // Redirect to homepage
      }
    }
  }, [navigate]);

  const renderContent = () => {
    switch (selected) {
      case "dashboard":
        return <Dashboard />;
      case "product":
        return <ProductManagement />;
      case "blog":
        return <BlogManagement />;
      case "category":
        return <CategoryManagement />;
      case "brand":
        return <BrandManagement />;
        case "blog-category":
        return <BlogCategoryManagement />;
      case "order":
        return <OrderManagement />;
      case "user":
        return <UserManagement />;
        case "voucher":
        return <VoucherManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Fragment>
      <SEO titleTemplate="Admin" description="Lactobloom Admin Page." />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Trang Chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            { label: "Quản Lý", path: import.meta.env.VITE_PUBLIC_URL + pathname },
          ]}
        />
        <div className="row">
          <Sidebar onSelect={setSelected} role={role} />
          <div className="col-lg-9">
            {renderContent()}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Admin;
