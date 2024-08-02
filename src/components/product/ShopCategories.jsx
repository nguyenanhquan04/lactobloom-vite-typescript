import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../utils/CategoryService";
import { setActiveSort } from "../../helpers/product";

const ShopCategories = ({ getSortParams, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = async (categoryId) => {
    onCategorySelect(categoryId);
  };

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Categories </h4>
      <div className="sidebar-widget-list mt-30">
        {loading ? (
          "Loading categories..."
        ) : error ? (
          `Error: ${error}`
        ) : categories && categories.length > 0 ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  onClick={e => {
                    getSortParams("categoryName", "");
                    handleCategorySelect(null);
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> All Categories
                </button>
              </div>
            </li>
            {categories.map((category) => (
              <li key={category.categoryId}>
                <div className="sidebar-widget-list-left">
                  <button
                    onClick={e => {
                      handleCategorySelect(category.categoryId);
                      setActiveSort(e);
                    }}
                  >
                    <span className="checkmark" /> {category.categoryName}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          "No category found"
        )}
      </div>
    </div>
  );
};

ShopCategories.propTypes = {
  onCategorySelect: PropTypes.func,
  getSortParams: PropTypes.func
};

export default ShopCategories;
