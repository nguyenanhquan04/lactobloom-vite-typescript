import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { getProducts } from "../../helpers/product";
import ProductGridSingle from "../../components/product/ProductGridSingle";

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
  const { products } = useSelector((state: any) => state.product);
  const currency = useSelector((state: any) => state.currency);
  const { cartItems } = useSelector((state: any) => state.cart);
  const { wishlistItems } = useSelector((state: any) => state.wishlist);
  const { compareItems } = useSelector((state: any) => state.compare);
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
