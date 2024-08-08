import React from "react";
import clsx from "clsx";
import ShopSearch from "../../components/product/ShopSearch";
import ShopCategoryAndBrand from "../../components/product/ShopCategoryAndBrand";

interface ShopSidebarProps {
  sideSpaceClass: string;
  onCategorySelect: any;
  onBrandSelect: any;
};

const ShopSidebar: React.FC<ShopSidebarProps> = ({
  sideSpaceClass,
  onCategorySelect,
  onBrandSelect,
}) => {
  return (
    <div className={clsx("sidebar-style", sideSpaceClass)}>
      {/* shop search */}
      <ShopSearch />

      <ShopCategoryAndBrand
      onCategorySelect={onCategorySelect}
      onBrandSelect={onBrandSelect}
      />
    </div>
  );
};



export default ShopSidebar;
