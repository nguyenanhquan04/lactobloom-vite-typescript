import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { getDiscountPrice } from '../../helpers/product';
import Rating from './sub-components/ProductRating';
import ProductModal from './ProductModal';
import { useCart } from '../../store/contexts/cart-context';
import { useWishlist } from '../../store/contexts/wishlist-context';
import { useCompare } from '../../store/contexts/compare-context';
import { getImagesByProductId } from '../../utils/ImageService';
import { getProductReviewByProductId } from '../../utils/ProductReviewService';
import Cookies from 'js-cookie';
import { myWishlist, saveWishlist } from '../../utils/WishlistService';

interface ProductGridListSingleProps {
  product: {
    price: number;
    discount: number;
    productId: number;
    productName: string;
    new: boolean;
    stock: number;
    preOrder: boolean;
    shortDescription: string;
  };
  cartItem?: {
    quantity: number;
  };
  wishlistItem?: object;
  compareItem?: object;
  spaceBottomClass?: string;
}

const ProductGridListSingle: React.FC<ProductGridListSingleProps> = ({
  product,
  cartItem,
  wishlistItem,
  compareItem,
  spaceBottomClass
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [productImages, setProductImages] = useState('/assets/img/no-image.png');
  const [averageRating, setAverageRating] = useState(0);
  const [wishlistData, setWishlistData] = useState<any[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const discountedPrice = getDiscountPrice(product.price, product.discount) as number;
  const finalProductPrice = +(product.price * 1);
  const finalDiscountedPrice = +(discountedPrice * 1);

  const { addToCart, cartItemsState } = useCart();
  const { addToWishlist, wishlistItemsState } = useWishlist();
  const { addToCompare, compareItemsState } = useCompare();
  const { cartItems } = cartItemsState;
  const { wishlistItems } = wishlistItemsState;
  const { compareItems } = compareItemsState;

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const response = await getImagesByProductId(product.productId);
        setProductImages(response.data[0].imageUrl);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    const fetchProductReviews = async () => {
      try {
        const response = await getProductReviewByProductId(product.productId);
        const reviews = response.data;
        const totalRating = reviews.reduce((acc: any, review: any) => acc + review.rate, 0);
        const avgRating = reviews.length ? totalRating / reviews.length : 0;
        setAverageRating(avgRating);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchWishlistData = async () => {
      try {
        const token = Cookies.get('authToken') || null;
        setAuthToken(token);
        if (token) {
          const response = await myWishlist(token);
          setWishlistData(response.data);
          response.data.forEach((item: any) => {
            if (item.productId === product.productId) {
              addToWishlist(product);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching wishlist data:', error);
      }
    };

    fetchProductImages();
    fetchProductReviews();
    fetchWishlistData();
  }, [product.productId, addToWishlist, product]);

  const isProductInWishlist = wishlistItems.some(
    (wishlistItem: any) => wishlistItem.productId === product.productId
  );

  const handleWishlistClick = async (product: any) => {
    if (authToken) {
      try {
        await saveWishlist(authToken, product.productId);
        addToWishlist(product);
      } catch (error) {
        console.error('Error saving to wishlist:', error);
      }
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Fragment>
      <div className={clsx('product-wrap', spaceBottomClass)}>
        <div className="product-img">
          <Link to={'/product/' + product.productId}>
            <img
              className="default-img"
              src={productImages}
              alt={product.productName}
            />
          </Link>
          {product.discount || product.new ? (
            <div className="product-img-badges">
              {product.discount ? (
                <span className="pink">-{product.discount}%</span>
              ) : (
                ''
              )}
              {product.new ? <span className="purple">New</span> : ''}
            </div>
          ) : (
            ''
          )}

          <div className="product-action">
            <div className="pro-same-action pro-wishlist">
              <button
                className={isProductInWishlist ? 'active' : ''}
                disabled={isProductInWishlist}
                title={
                  isProductInWishlist
                    ? 'Đã thêm vào yêu thích'
                    : 'Thêm vào yêu thích'
                }
                onClick={() => handleWishlistClick(product)}
              >
                <i className="pe-7s-like" />
              </button>
            </div>
            <div className="pro-same-action pro-cart">
              {product.stock && product.stock > 0 && product.preOrder === false ? (
                <button
                  onClick={() => addToCart(product)}
                  className={
                    cartItem !== undefined && cartItem.quantity > 0
                      ? 'active'
                      : ''
                  }
                  disabled={cartItem !== undefined && cartItem.quantity > 0}
                  title={
                    cartItem !== undefined ? 'Đã thêm' : 'Thêm vào giỏ'
                  }
                >
                  {' '}
                  <i className="pe-7s-cart"></i>{' '}
                  {cartItem !== undefined && cartItem.quantity > 0
                    ? 'Đã thêm'
                    : 'Thêm vào giỏ'}
                </button>
              ) : product.stock > 0 && product.preOrder && authToken ? (
                <button
                  onClick={() => addToCart(product)}
                  className={
                    cartItem !== undefined && cartItem.quantity > 0
                      ? 'active'
                      : ''
                  }
                  disabled={cartItem !== undefined && cartItem.quantity > 0}
                  title={
                    cartItem !== undefined
                      ? 'Đã thêm vào giỏ hàng'
                      : 'Đặt trước'
                  }
                >
                  {' '}
                  <i className="pe-7s-cart"></i>{' '}
                  {cartItem !== undefined && cartItem.quantity > 0
                    ? 'Đã thêm'
                    : 'Đặt trước'}
                </button>
              ) : (
                <button disabled className="active">
                  Hết hàng
                </button>
              )}
            </div>
            <div className="pro-same-action pro-quickview">
              <button onClick={() => setModalShow(true)} title="Quick View">
                <i className="pe-7s-look" />
              </button>
            </div>
          </div>
        </div>
        <div className="product-content text-center">
          {(product.stock <= 0 && product.preOrder && authToken) ?
          <h3>
            <Link to={'/product/' + product.productId}>
              {product.productName} (Đặt trước)
            </Link> 
          </h3>
          :
          <h3>
            <Link to={'/product/' + product.productId}>
              {product.productName}
            </Link>
          </h3>}
          {averageRating && averageRating > 0 ? (
            <div className="product-rating">
              <Rating ratingValue={averageRating} />
              <span>({averageRating.toFixed(1)} out of 5)</span>
            </div>
          ) : (
            <div className="product-rating">
              <Rating ratingValue={0} />
              <span>(0 out of 5)</span>
            </div>
          )}
          <div className="product-price">
            {discountedPrice !== null ? (
              <Fragment>
                <span>{finalDiscountedPrice.toLocaleString("vi-VN") + " VND"}</span>{" "}
                <span className="old">
                  {finalProductPrice.toLocaleString("vi-VN") + " VND"}
                </span>
              </Fragment>
            ) : (
              <span>{finalProductPrice.toLocaleString("vi-VN") + " VND"} </span>
            )}
          </div>
        </div>
      </div>
      <div className="shop-list-wrap mb-30">
        <div className="row">
          <div className="col-xl-4 col-md-5 col-sm-6">
            <div className="product-list-image-wrap">
              <div className="product-img">
                <Link to={"/product/" + product.productId}>
                  <img
                    className="default-img img-fluid"
                    src={productImages}
                    alt={product.productName}
                  />
                </Link>
                {product.discount || product.new ? (
                  <div className="product-img-badges">
                    {product.discount ? (
                      <span className="pink">-{product.discount}%</span>
                    ) : (
                      ""
                    )}
                    {product.new ? <span className="purple">New</span> : ""}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-8 col-md-7 col-sm-6">
            <div className="shop-list-content">
              <h3>
                <Link to={"/product/" + product.productId}>
                  {product.productName}
                </Link>
              </h3>
              {averageRating && averageRating > 0 ? (
                <div className="product-list-rating">
                  <Rating ratingValue={averageRating} />
                  <span>({averageRating.toFixed(1)} out of 5)</span>
                </div>
              ) : (
                <div className="product-list-rating">
                  <Rating ratingValue={0} />
                  <span>(0 out of 5)</span>
                </div>
              )}
              {discountedPrice !== null ? (
                <div className="product-list-price">
                  <span>
                    {finalDiscountedPrice.toLocaleString("vi-VN") + " VND"}
                  </span>{" "}
                  <span className="old">
                    {finalProductPrice.toLocaleString("vi-VN") + " VND"}
                  </span>
                </div>
              ) : (
                <div className="product-list-price">
                  <span>
                    {finalProductPrice.toLocaleString("vi-VN") + " VND"}
                  </span>
                </div>
              )}
              {product.shortDescription ? (
                <p>{product.shortDescription}</p>
              ) : (
                ""
              )}

              <div className="shop-list-actions d-flex align-items-center">
                <div className="shop-list-btn btn-hover">
                  {product.stock && product.stock > 0 && product.preOrder === false ? (
                    <button
                      onClick={() => addToCart(product)}
                      className={
                        cartItem !== undefined && cartItem.quantity > 0
                          ? "active"
                          : ""
                      }
                      disabled={cartItem !== undefined && cartItem.quantity > 0}
                      title={
                        cartItem !== undefined ? "Đã thêm" : "Thêm vào giỏ"
                      }
                    >
                      {" "}
                      <i className="pe-7s-cart"></i>{" "}
                      {cartItem !== undefined && cartItem.quantity > 0
                        ? "Đã thêm"
                        : "Thêm vào giỏ"}
                    </button>
                  ) : product.stock >= 0 && product.preOrder && authToken ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="active"
                      title="Pre Order"
                    >
                      {" "}
                      <i className="pe-7s-cart"></i> Đặt trước
                    </button>
                  ) : (
                    <button disabled className="active">
                      Hết hàng
                    </button>
                  )}
                </div>
                <div className="shop-list-wishlist ml-10">
                  <button
                    className={isProductInWishlist ? "active" : ""}
                    disabled={isProductInWishlist}
                    title={
                      isProductInWishlist
                        ? "Đã thêm vào yêu thích"
                        : "Thêm vào yêu thích"
                    }
                    onClick={() => handleWishlistClick(product)}
                  >
                    <i className="pe-7s-like" />
                  </button>
                </div>
                <div className="shop-list-compare ml-10">
                  <button
                    className={compareItem !== undefined ? "active" : ""}
                    disabled={compareItem !== undefined}
                    title={
                      compareItem !== undefined
                        ? "Đã thêm vào so sánh"
                        : "Thêm vào so sánh"
                    }
                    onClick={() => addToCompare(product)}
                  >
                    <i className="pe-7s-shuffle" />
                  </button>
                </div>
                <div className="shop-list-quickview ml-10">
                  <button
                    onClick={() => setModalShow(true)}
                    title="Quick View"
                  >
                    <i className="pe-7s-look" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        discountedPrice={discountedPrice}
        finalProductPrice={finalProductPrice}
        finalDiscountedPrice={finalDiscountedPrice}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
      />
    </Fragment>
  );
};

export default ProductGridListSingle;
