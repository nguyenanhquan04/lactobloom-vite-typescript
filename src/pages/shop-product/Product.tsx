import React, { Fragment, useEffect } from "react"; 
import { useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import Cookies from "js-cookie"; // Import js-cookie
import {jwtDecode} from "jwt-decode";

const Product = () => {
  let { pathname } = useLocation();
  let { id } = useParams();
  const { products } = useSelector((state: any) => state.product);
  const product = products.find(product => String(product.productId) === id);
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
  

  return (
    <Fragment>
      <SEO
        titleTemplate="Product"
        description="Lactobloom Product Page."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Trang chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            {label: "Sản phẩm", path: import.meta.env.VITE_PUBLIC_URL + pathname }
          ]} 
        />

          

        {/* product description with image */}
        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={product}
        />

        {/* product description tab */}
        <ProductDescriptionTab
          spaceBottomClass="pb-90"
          productFullDesc={product.longDescription}
          productId={product.productId}
        />

        {/* related product slider */}
        <RelatedProductSlider
          spaceBottomClass="pb-95"
        />
      </LayoutOne>
    </Fragment>
  );
};

export default Product;
