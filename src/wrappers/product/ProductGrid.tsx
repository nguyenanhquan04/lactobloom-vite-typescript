import React, { Fragment } from "react";
import { getProducts } from "../../helpers/product";
import ProductGridSingle from "../../components/product/ProductGridSingle";
import { useCart } from "../../store/contexts/cart-context";
import { useWishlist } from "../../store/contexts/wishlist-context";
import { useCompare } from "../../store/contexts/compare-context";
import { useProduct } from "../../store/contexts/product-context";

interface ProductGridProps {
  spaceBottomClass: string;
  type: string;
  limit: number;
};

const ProductGrid: React.FC<ProductGridProps> = ({
  spaceBottomClass,
  type,
  limit
}) => {
  const {cartItemsState} = useCart();
  const { wishlistItemsState} = useWishlist();
  const {compareItemsState} = useCompare();
  const { productsItemsState } = useProduct();
  const { products } = productsItemsState;
  const { cartItems } = cartItemsState;
  const { wishlistItems } = wishlistItemsState;
  const { compareItems } = compareItemsState;
  const prods = getProducts(products, type, limit)
  
  return (
    <Fragment>
      {prods?.map((product: any) => {
        return (
          <div className="col-xl-3 col-md-6 col-lg-4 col-sm-6" key={product.productId}>
            <ProductGridSingle
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

export default ProductGrid;
