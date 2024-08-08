import { Fragment, useState, useEffect } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Rating from "../../components/product/sub-components/ProductRating";
import { addToCart } from "../../store/slices/cart-slice";
import { deleteFromCompare } from "../../store/slices/compare-slice";
import { getImagesByProductId } from "../../utils/ImageService";
import Cookies from "js-cookie"; // Import js-cookie
import {jwtDecode} from "jwt-decode";

interface ImagesMap {
  [key: string]: string;
}

interface compareImages {
  [key: string]: string;
}

const Compare = () => {
  const dispatch = useDispatch();
  let { pathname } = useLocation();

  const { compareItems } = useSelector((state: any) => state.compare);
  const { cartItems } = useSelector((state: any) => state.cart);

  const [compareImages, setCompareImages] = useState<compareImages>({});
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
    const fetchCompareImages = async () => {
      const imagesMap: ImagesMap = {};
      for (const compareItem of compareItems) {
        try {
          const response = await getImagesByProductId(compareItem.productId);
          imagesMap[compareItem.productId] = response.data.length > 0 ? response.data[0].imageUrl : "/assets/img/no-image.png";
        } catch (error) {
          console.error("Error fetching images:", error);
          imagesMap[compareItem.productId] = "/assets/img/no-image.png";
        }
      }
      setCompareImages(imagesMap);
    };

    if (compareItems.length > 0) {
      fetchCompareImages();
    }
  }, [compareItems]);

  return (
    <Fragment>
      <SEO
        titleTemplate="Compare"
        description="Lactobloom Compare Page."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Trang Chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            {label: "So Sánh", path: import.meta.env.VITE_PUBLIC_URL + pathname }
          ]} 
        />
        <div className="compare-main-area pt-90 pb-100">
          <div className="container">
            {compareItems && compareItems.length >= 1 ? (
              <div className="row">
                <div className="col-lg-12">
                  <div className="compare-page-content">
                    <div className="compare-table table-responsive">
                      <table className="table table-bordered mb-0">
                        <tbody>
                          <tr>
                            <th className="title-column">Thông tin sản phẩm</th>
                            {compareItems.map((compareItem: any, key: any) => {
                              const cartItem = cartItems.find(
                                item => item.productId === compareItem.productId
                              );
                              return (
                                <td className="product-image-title" key={key}>
                                  <div className="compare-remove">
                                    <button
                                      onClick={() =>
                                        dispatch(deleteFromCompare(compareItem.productId))
                                      }
                                    >
                                      <i className="pe-7s-trash" />
                                    </button>
                                  </div>
                                  <Link
                                    to={
                                      import.meta.env.VITE_PUBLIC_URL +
                                      "/product/" +
                                      compareItem.productId
                                    }
                                    className="image"
                                  >
                                    <img
                                      className="img-fluid"
                                      src={
                                        import.meta.env.VITE_PUBLIC_URL +
                                        (compareImages[compareItem.productId] || "/assets/img/no-image.png")
                                      }
                                      alt={compareItem.productName}
                                    />
                                  </Link>
                                  <div className="product-title">
                                    <Link
                                      to={
                                        import.meta.env.VITE_PUBLIC_URL +
                                        "/product/" +
                                        compareItem.productId
                                      }
                                    >
                                      {compareItem.productName}
                                    </Link>
                                  </div>
                                  <div className="compare-btn">
                                    {compareItem.affiliateLink ? (
                                      <a
                                        href={compareItem.affiliateLink}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                      >
                                        {" "}
                                        Mua ngay{" "}
                                      </a>
                                    ) : compareItem.variation &&
                                      compareItem.variation.length >= 1 ? (
                                      <Link
                                        to={`${import.meta.env.VITE_PUBLIC_URL}/product/${compareItem.productId}`}
                                      >
                                        Lựa chọn
                                      </Link>
                                    ) : compareItem.stock &&
                                      compareItem.stock > 0 ? (
                                      <button
                                        onClick={() =>
                                          dispatch(addToCart(compareItem))
                                        }
                                        className={
                                          cartItem !== undefined &&
                                          cartItem.quantity > 0
                                            ? "active"
                                            : ""
                                        }
                                        disabled={
                                          cartItem !== undefined &&
                                          cartItem.quantity > 0
                                        }
                                        title={
                                          compareItem !== undefined
                                            ? "Đã thêm "
                                            : "Thêm vào giỏ"
                                        }
                                      >
                                        {cartItem !== undefined &&
                                        cartItem.quantity > 0
                                          ? "Đã thêm"
                                          : "Thêm vào giỏ"}
                                      </button>
                                    ) : (
                                      <button disabled className="active">
                                        Hết hàng
                                      </button>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                          <tr>
                            <th className="title-column">Giá</th>
                            {compareItems.map((compareItem: any, key: any) => {
                              const discountedPrice = getDiscountPrice(
                                compareItem.price,
                                compareItem.discount
                              );
                              const finalProductPrice = (
                                compareItem.price * 1
                              );
                              const finalDiscountedPrice = discountedPrice as number;
                              return (
                                <td className="product-price" key={key}>
                                  {discountedPrice !== null ? (
                                    <Fragment>
                                      <span className="amount old">
                                        {finalProductPrice.toLocaleString("vi-VN") + " VND"}
                                      </span>
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
                              );
                            })}
                          </tr>

                          <tr>
                            <th className="title-column">Mô tả</th>
                            {compareItems.map((compareItem: any, key: any) => {
                              return (
                                <td className="product-desc" key={key}>
                                  <p>
                                    {compareItem.description
                                      ? compareItem.description
                                      : "N/A"}
                                  </p>
                                </td>
                              );
                            })}
                          </tr>

                          <tr>
                            <th className="title-column">Đánh giá</th>
                            {compareItems.map((compareItem: any, key: any) => {
                              return (
                                <td className="product-rating" key={key}>
                                  <Rating ratingValue={compareItem.rating} />
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-shuffle"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in compare <br />{" "}
                      <Link to={import.meta.env.VITE_PUBLIC_URL + "/shop"}>
                        Add Items
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

export default Compare;

