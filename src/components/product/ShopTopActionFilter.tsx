import PropTypes from "prop-types";
import React, { Fragment } from "react";
import ShopTopFilter from "./ShopTopFilter";
import { toggleShopTopFilter } from "../../helpers/product";

interface ShopTopActionFilterProps {
  getFilterSortParams: any;
  getSortParams: any;
  productCount: number;
  products: any[];
  sortedProductCount: number;
}

const ShopTopActionFilter: React.FC<ShopTopActionFilterProps> = ({
  getFilterSortParams,
  productCount,
  sortedProductCount,
  products,
  getSortParams
}) => {
  return (
    <Fragment>
      <div className="shop-top-bar mb-35">
        <div className="select-shoing-wrap">
          <div className="shop-select">
            <select
              onChange={e => getFilterSortParams("filterSort", e.target.value)}
            >
              <option value="default">Default</option>
              <option value="priceHighToLow">Price - High to Low</option>
              <option value="priceLowToHigh">Price - Low to High</option>
            </select>
          </div>
          <p>
            Showing {sortedProductCount} of {productCount} result
          </p>
        </div>

        <div className="filter-active">
          <button onClick={e => toggleShopTopFilter(e)}>
            <i className="fa fa-plus"></i> filter
          </button>
        </div>
      </div>

      {/* shop top filter */}
      <ShopTopFilter products={products} getSortParams={getSortParams} />
    </Fragment>
  );
};

export default ShopTopActionFilter;
