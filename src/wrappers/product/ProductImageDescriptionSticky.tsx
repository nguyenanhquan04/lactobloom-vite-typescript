import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";
import ProductDescriptionInfo from "../../components/product/ProductDescriptionInfo";
import ProductImageGallerySticky from "../../components/product/ProductImageGallerySticky";
import { useCart } from "../../store/contexts/cart-context";
import { useCompare } from "../../store/contexts/compare-context";

interface ProductImageDescriptionStickyProps {
  product?: any;
  spaceBottomClass?: string;
  spaceTopClass?: string;
};


const ProductImageDescriptionSticky: React.FC<ProductImageDescriptionStickyProps> = ({ spaceTopClass, spaceBottomClass, product }) => {
  const { cartItemsState } = useCart();
  const { compareItemsState } = useCompare();
  
  const { cartItems } = cartItemsState;
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
            <ProductImageGallerySticky product={product} />
          </div>
          <div className="col-lg-6 col-md-6">
            <div
              style={{ position: "sticky", top: "75px" }}
            >
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
    </div>
  );
};

export default ProductImageDescriptionSticky;
