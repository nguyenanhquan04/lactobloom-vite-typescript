import React from "react";
import { setActiveLayout } from "../../helpers/product";

interface ShopTopActionProps {
  getFilterSortParams?: any;
  getLayout: any;
  productCount: number;
  sortedProductCount: number;
}

const ShopTopAction: React.FC<ShopTopActionProps> = ({
  getLayout
}) => {
  return (
    <div className="shop-top-bar mb-35">
      <div className="select-shoing-wrap">
      </div>

      <div className="shop-tab">
        <button
          onClick={e => {
            getLayout("grid two-column");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-th-large" />
        </button>
        <button
          onClick={e => {
            getLayout("grid three-column");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-th" />
        </button>
      </div>
    </div>
  );
};

export default ShopTopAction;
