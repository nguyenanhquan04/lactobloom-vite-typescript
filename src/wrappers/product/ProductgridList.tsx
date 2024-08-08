import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import ProductGridListSingle from "../../components/product/ProductGridListSingle";

interface ProductGridListProps {
  products?: any[];
  spaceBottomClass?: string;
};

const ProductGridList: React.FC<ProductGridListProps> = ({
  products,
  spaceBottomClass
}) => {
  const { cartItems } = useSelector((state: any) => state.cart);
  const { wishlistItems } = useSelector((state: any) => state.wishlist);
  const { compareItems } = useSelector((state: any) => state.compare);
  
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
