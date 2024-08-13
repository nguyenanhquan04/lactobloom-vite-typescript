import React from "react";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import ProductDescriptionInfo from "../../components/product/ProductDescriptionInfo";
import ProductImageGallerySideThumb from "../../components/product/ProductImageGallerySideThumb";
import ProductImageFixed from "../../components/product/ProductImageFixed";
import { useCart } from "../../store/contexts/cart-context";
import { useWishlist } from "../../store/contexts/wishlist-context";
import { useCompare } from "../../store/contexts/compare-context";

interface ProductImageDescriptionProps {
  galleryType?: string;
  product?: any;
  spaceBottomClass?: string;
  spaceTopClass?: string;
};


const ProductImageDescription: React.FC<ProductImageDescriptionProps> = ({ spaceTopClass, spaceBottomClass, galleryType, product }) => {
  const {cartItemsState} = useCart();
  const { wishlistItemsState} = useWishlist();
  const {compareItemsState} = useCompare();
  const { cartItems } = cartItemsState;
  const { wishlistItems } = wishlistItemsState;
  const { compareItems } = compareItemsState;
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
          <div className="col-lg-6 col-md-6">
            {/* product image gallery */}
            {galleryType === "leftThumb" ? (
              <ProductImageGallerySideThumb
                product={product}
                thumbPosition="left"
              />
            ) : galleryType === "rightThumb" ? (
              <ProductImageGallerySideThumb product={product} />
            ) : galleryType === "fixedImage" ? (
              <ProductImageFixed product={product} />
            ) : (
              <ProductImageGallery product={product} />
            )}
          </div>
          <div className="col-lg-6 col-md-6">
            {/* product description info */}
            <ProductDescriptionInfo
              product={product}
              discountedPrice={discountedPrice}
              finalDiscountedPrice={finalDiscountedPrice}
              finalProductPrice={finalProductPrice}
              cartItems={cartItems}
              compareItem={compareItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageDescription;
