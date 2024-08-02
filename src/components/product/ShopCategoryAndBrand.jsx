import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../utils/CategoryService";
import { getAllBrands } from "../../utils/BrandService";
import { setActiveSort } from "../../helpers/product";

const ShopCategoryAndBrand = ({
  onCategorySelect,
  onBrandSelect,
}) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const [errorBrands, setErrorBrands] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        setErrorCategories(error.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        setBrands(response.data);
      } catch (error) {
        setErrorBrands(error.message);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  const handleAllCategories = (e) => {
    setSelectedCategories([]);
    onCategorySelect([]);
    setActiveSort(e, "category");
  };

  const handleAllBrands = (e) => {
    setSelectedBrands([]);
    onBrandSelect([]);
    setActiveSort(e, "brand");
  };

  const handleCategorySelect = (categoryId, e) => {
    if (categoryId === null) {
      setSelectedCategories([]);
      onCategorySelect([]);
    } else {
      setSelectedCategories([categoryId]);
      onCategorySelect([categoryId]);
    }
    setActiveSort(e, "category");
  };

  const handleBrandSelect = (brandId, e) => {
    if (brandId === null) {
      setSelectedBrands([]);
      onBrandSelect([]);
    } else {
      setSelectedBrands([brandId]);
      onBrandSelect([brandId]);
    }
    setActiveSort(e, "brand");
  };

  return (
    <div>
      <div className="sidebar-widget">
        <h3 className="pro-sidebar-title">Danh mục</h3>
        <div className="sidebar-widget-list mt-30">
          <ul>
            <li>
              <div className="sidebar-widget-list-left all">
                <button
                  onClick={handleAllCategories}
                  className={selectedCategories.length === 0 ? "active" : ""}
                >
                  <span className="checkmark" /> Tất cả
                </button>
              </div>
            </li>
            {loadingCategories ? (
              "Loading categories..."
            ) : errorCategories ? (
              `Error: ${errorCategories}`
            ) : categories && categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.categoryId}>
                  <div className="sidebar-widget-list-left category">
                    <button
                      onClick={(e) => handleCategorySelect(category.categoryId, e)}
                      className={
                        selectedCategories.includes(category.categoryId)
                          ? "active"
                          : ""
                      }
                    >
                      <span className="checkmark" /> {category.categoryName}
                    </button>
                  </div>
                </li>
              ))
            ) : (
              "No category found"
            )}
          </ul>
        </div>
      </div>

      <div className="sidebar-widget mt-50">
        <h3 className="pro-sidebar-title">Thương hiệu</h3>
        <div className="sidebar-widget-list mt-25">
          <ul>
            <li>
              <div className="sidebar-widget-list-left all">
                <button
                  onClick={handleAllBrands}
                  className={selectedBrands.length === 0 ? "active" : ""}
                >
                  <span className="checkmark" /> Tất cả
                </button>
              </div>
            </li>
            {loadingBrands ? (
              "Loading brands..."
            ) : errorBrands ? (
              `Error: ${errorBrands}`
            ) : brands && brands.length > 0 ? (
              brands.map((brand) => (
                <li key={brand.brandId}>
                  <div className="sidebar-widget-list-left brand">
                    <button
                      onClick={(e) => handleBrandSelect(brand.brandId, e)}
                      className={
                        selectedBrands.includes(brand.brandId)
                          ? "active"
                          : ""
                      }
                    >
                      <span className="checkmark" /> {brand.brandName}
                    </button>
                  </div>
                </li>
              ))
            ) : (
              "No brand found"
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

ShopCategoryAndBrand.propTypes = {
  onCategorySelect: PropTypes.func.isRequired,
  onBrandSelect: PropTypes.func.isRequired,
};

export default ShopCategoryAndBrand;
