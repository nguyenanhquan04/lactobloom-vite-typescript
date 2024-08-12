import React, { Fragment, useEffect } from "react"; 
import { useParams, useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import Cookies from "js-cookie"; // Import js-cookie
import {jwtDecode} from "jwt-decode";
import { useProduct } from "../../store/contexts/product-context";

const Product = () => {
  const { productsItemsState } = useProduct();
  let { pathname } = useLocation();
  let { id } = useParams();
  const { products } = productsItemsState;
  const product = products.find((product: any) => product.productId == id);
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
    console.log("Product", products),
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
