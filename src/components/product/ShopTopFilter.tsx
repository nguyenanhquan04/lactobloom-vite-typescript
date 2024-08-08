import React from "react";

import {
  getIndividualCategories,

  setActiveSort
} from "../../helpers/product";

interface ShopTopFilterProps {
  getSortParams: any;
  products: any[];
}

const ShopTopFilter: React.FC<ShopTopFilterProps> = ({ products, getSortParams }) => {
  const uniqueCategories = getIndividualCategories(products);
  return (
    <div className="product-filter-wrapper" id="product-filter-wrapper">
      <div className="product-filter-wrapper__inner">
        <div className="row">
          {/* Product Filter */}
          <div className="col-md-3 col-sm-6 col-xs-12 mb-30">
            <div className="product-filter">
              <h5>Categories</h5>
              {uniqueCategories ? (
                <ul>
                  {uniqueCategories.map((category: any, key: any) => {
                    return (
                      <li key={key}>
                        <button
                          onClick={e => {
                            getSortParams("category", category);
                            setActiveSort(e);
                          }}
                        >
                          {category}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                "No categories found"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopTopFilter;