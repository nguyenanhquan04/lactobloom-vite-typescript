import React, { Fragment } from "react";
import ProductGridListSingle from "../../components/product/ProductGridListSingle";
import { useCart } from "../../store/contexts/cart-context";
import { useWishlist } from "../../store/contexts/wishlist-context";
import { useCompare } from "../../store/contexts/compare-context";

interface ProductGridListProps {
  products?: any[];
  spaceBottomClass?: string;
};

const ProductGridList: React.FC<ProductGridListProps> = ({
  products,
  spaceBottomClass
}) => {
  const { cartItemsState } = useCart();
  const { wishlistItemsState } = useWishlist();
  const { compareItemsState } = useCompare();

  const { cartItems } = cartItemsState;
  const { wishlistItems } = wishlistItemsState;
  const { compareItems } = compareItemsState;
  
  return (
    <Fragment>
      {products?.map(product => {
        return (
          <div className="col-xl-4 col-sm-6" key={product.productId}>
            <ProductGridListSingle
              spaceBottomClass={spaceBottomClass}
              product={product}
              cartItem={
                cartItems.find((cartItem: any) => cartItem.productId === product.productId)
              }
              wishlistItem={
                wishlistItems.find(
                  (wishlistItem: any) => wishlistItem.productId === product.productId
                )
              }
              compareItem={
                compareItems.find(
                  (compareItem: any) => compareItem.productId === product.productId
                )
              }
            />
          </div>
        );
      })}
    </Fragment>
  );
};

export default ProductGridList;
