import PropTypes from "prop-types";
import React, { Fragment } from "react";
import ShopTopAction from "../../components/product/ShopTopAction";

interface ShopTopbarProps {
  getLayout: any;
  productCount: any;
  sortedProductCount: any;
};

const ShopTopbar: React.FC<ShopTopbarProps> = ({
  getLayout,
  productCount,
  sortedProductCount
}) => {
  return (
    <Fragment>
      {/* shop top action */}
      <ShopTopAction
        getLayout={getLayout}
        productCount={productCount}
        sortedProductCount={sortedProductCount}
      />
    </Fragment>
  );
};



export default ShopTopbar;
