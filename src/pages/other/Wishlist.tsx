import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlistFormAPI, deleteFromWishlist, deleteAllFromWishlist } from "../../store/slices/wishlist-slice";

import { getImagesByProductId } from "../../utils/ImageService";
import Cookies from "js-cookie"; // Import js-cookie
import {jwtDecode} from "jwt-decode";
import { deleteWishlist, myWishlist } from "../../utils/WishlistService";
import { getProductByProductId } from "../../utils/ProductService";

interface ImagesMap {
  [key: string]: any;
}

interface WishlistImages {
  [key: string]: any;
}

const Wishlist = () => {
  const dispatch = useDispatch();
  let { pathname } = useLocation();

  const { wishlistItems: reduxWishlistItems } = useSelector((state: any) => state.wishlist);
  const { cartItems } = useSelector((state: any) => state.cart);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistImages, setWishlistImages] = useState<WishlistImages>({});
  const [loading, setLoading] = useState(true);

  const authToken = Cookies.get("authToken");

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
    const fetchWishlistItems = async () => {
      if (authToken) {
        try {
          const response = await myWishlist(authToken);
          const wishlistData = response.data;

          const productPromises = wishlistData.map(async item => {
            const productResponse = await getProductByProductId(item.productId);
            return {
              ...productResponse.data,
              wishlistId: item.wishlistId // Adding the wishlistId from the wishlist API response
            };
          });

          const productsWithWishlistId = await Promise.all(productPromises) as any;
          setWishlistItems(productsWithWishlistId);
        } catch (error) {
          console.error("Error fetching wishlist items:", error);
        }
      } else {
        setWishlistItems(reduxWishlistItems);
      }
      setLoading(false);
    };

    fetchWishlistItems();
  }, [authToken, reduxWishlistItems]);

  useEffect(() => {
    const fetchWishlistImages = async () => {
      const imagesMap: ImagesMap = {};
      for (const wishlistItem of wishlistItems as any) {
        try {
          const response = await getImagesByProductId(wishlistItem.productId);
          imagesMap[wishlistItem.productId] = response.data.length > 0 ? response.data[0].imageUrl : "/assets/img/no-image.png";
        } catch (error) {
          console.error("Error fetching images:", error);
          imagesMap[wishlistItem.productId] = "/assets/img/no-image.png";
        }
      }
      setWishlistImages(imagesMap);
    };

    if (wishlistItems.length > 0) {
      fetchWishlistImages();
    }
  }, [wishlistItems]);

  const handleRemoveFromWishlist = async (wishlistId: number, productId: number) => {
    if (authToken) {
      try {
        await deleteWishlist(authToken, wishlistId);
        setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
        dispatch(deleteFromWishlist(productId));
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    } else {
      dispatch(deleteFromWishlist(productId));
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <Fragment>
      <SEO
        titleTemplate="Wishlist"
        description="Lactobloom Wishlist Page."
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb 
          pages={[
            { label: "Trang chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            { label: "Yêu thích", path: import.meta.env.VITE_PUBLIC_URL + pathname }
          ]} 
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {wishlistItems && wishlistItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Sản phẩm yêu thích</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Đơn giá</th>
                            <th>Thêm vào giỏ</th>
                            <th>Xóa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wishlistItems.map((wishlistItem: any, key: any) => {
                            const discountedPrice = getDiscountPrice(
                              wishlistItem.price,
                              wishlistItem.discount
                            );
                            const finalProductPrice = (
                              wishlistItem.price * 1
                            );
                            const finalDiscountedPrice = discountedPrice as number;
                            const cartItem = cartItems.find(
                              item => item.productId === wishlistItem.productId
                            );
                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      import.meta.env.VITE_PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem.productId
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={
                                        import.meta.env.VITE_PUBLIC_URL +
                                        (wishlistImages[wishlistItem.productId] || "/assets/img/no-image.png")
                                      }
                                      alt={wishlistItem.productName}
                                    />
                                  </Link>
                                </td>

                                <td className="product-name text-center">
                                  <Link
                                    to={
                                      import.meta.env.VITE_PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem.productId
                                    }
                                  >
                                    {wishlistItem.productName}
                                  </Link>
                                </td>

                                <td className="product-price-cart">
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

                                <td className="product-wishlist-cart">
                                  {wishlistItem.stock && wishlistItem.stock > 0 && wishlistItem.preOrder === false ? (
                                    <button
                                      onClick={() =>
                                        dispatch(addToCart(wishlistItem))
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
                                        wishlistItem !== undefined
                                          ? "Đã thêm"
                                          : "Thêm vào giỏ"
                                      }
                                    >
                                      {cartItem !== undefined &&
                                      cartItem.quantity > 0 && cartItem.preOrder === false
                                        ? "Đã thêm"
                                        : "Thêm vào giỏ"}
                                    </button>
                                  ) : wishlistItem.stock > 0 && wishlistItem.preOrder && authToken ? (
                                    <button
                                      onClick={() => dispatch(addToCart(wishlistItem))}
                                      className={
                                        cartItem !== undefined && cartItem.quantity > 0
                                          ? "active"
                                          : ""
                                      }
                                      disabled={
                                        cartItem !== undefined && cartItem.quantity > 0
                                      }
                                      title={
                                        wishlistItem !== undefined
                                          ? "Đã thêm vào giỏ hàng"
                                          : "Đặt trước"
                                      }
                                    >
                                      {cartItem !== undefined && cartItem.quantity > 0
                                        ? "Đã thêm"
                                        : "Đặt trước"}
                                    </button>
                                  ) : (
                                    <button disabled className="active">
                                      Hết hàng
                                    </button>
                                  )}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() => handleRemoveFromWishlist(wishlistItem.wishlistId, wishlistItem.productId)}
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link
                          to={import.meta.env.VITE_PUBLIC_URL + "/shop"}
                        >
                          Tiếp tục mua hàng
                        </Link>
                      </div>
                      {/* <div className="cart-clear">
                        <button onClick={() => dispatch(deleteAllFromWishlist())}>
                          Clear Wishlist
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-like"></i>
                    </div>
                    <div className="item-empty-area__text">
                      Không có sản phẩm yêu thích <br />{" "}
                      <Link to={import.meta.env.VITE_PUBLIC_URL + "/shop"}>
                        Thêm sản phẩm
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

export default Wishlist;
