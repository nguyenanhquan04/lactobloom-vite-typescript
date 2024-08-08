import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import ProductDescriptionInfo from "../../components/product/ProductDescriptionInfo";
import ProductImageGallerySideThumb from "../../components/product/ProductImageGallerySideThumb";
import ProductImageFixed from "../../components/product/ProductImageFixed";

interface ProductImageDescriptionProps {
  galleryType?: string;
  product?: any;
  spaceBottomClass?: string;
  spaceTopClass?: string;
};


const ProductImageDescription: React.FC<ProductImageDescriptionProps> = ({ spaceTopClass, spaceBottomClass, galleryType, product }) => {
  const { cartItems } = useSelector((state: any) => state.cart);
  const { wishlistItems } = useSelector((state: any) => state.wishlist);
  const { compareItems } = useSelector((state: any) => state.compare);
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
