import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";
import ProductImageGallerySlider from "../../components/product/ProductImageGallerySlider";
import ProductDescriptionInfoSlider from "../../components/product/ProductDescriptionInfoSlider";

interface ProductImageDescriptionProps {
  product: any;
  spaceBottomClass: string;
  spaceTopClass: string;
};

const ProductImageDescription: React.FC<ProductImageDescriptionProps> = ({ spaceTopClass, spaceBottomClass, product }) => {
  const { cartItems } = useSelector((state: any) => state.cart);
  const { wishlistItems } = useSelector((state: any) => state.wishlist);
  const { compareItems } = useSelector((state: any) => state.compare);
  const wishlistItem = wishlistItems.find((item: any) => item.productId === product.productId);
  const compareItem = compareItems.find((item: any) => item.productId === product.productId);

  const discountedPrice = getDiscountPrice(product.price, product.discount) as number;
  const finalProductPrice = +(product.price * 1);
  const finalDiscountedPrice = +(
    discountedPrice * 1
  );

  return (
    <div className={clsx("shop-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 mb-50">
            {/* product image gallery */}
            <ProductImageGallerySlider product={product} />
          </div>
          <div className="col-lg-12 text-center">
            {/* product description info */}
            <ProductDescriptionInfoSlider
              product={product}
              discountedPrice={discountedPrice}
              finalDiscountedPrice={finalDiscountedPrice}
              finalProductPrice={finalProductPrice}
              cartItems={cartItems}
              wishlistItem={wishlistItem}
              compareItem={compareItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageDescription;
