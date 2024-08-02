import PropTypes from "prop-types";
import clsx from "clsx";
import ShopSearch from "../../components/product/ShopSearch";
import ShopCategoryAndBrand from "../../components/product/ShopCategoryAndBrand";

const ShopSidebar = ({
  products,
  getSortParams,
  sideSpaceClass,
  onCategorySelect,
  onBrandSelect,
}) => {
  return (
    <div className={clsx("sidebar-style", sideSpaceClass)}>
      {/* shop search */}
      <ShopSearch />

      <ShopCategoryAndBrand
      getSortParams={getSortParams}
      onCategorySelect={onCategorySelect}
      onBrandSelect={onBrandSelect}
      />
    </div>
  );
};

ShopSidebar.propTypes = {
  getSortParams: PropTypes.func,
  products: PropTypes.array,
  sideSpaceClass: PropTypes.string,
  onCategorySelect: PropTypes.func, // Add this prop type
  onBrandSelect: PropTypes.func, // Add this prop type
};

export default ShopSidebar;
