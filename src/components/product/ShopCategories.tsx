import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../utils/CategoryService";
import { setActiveSort } from "../../helpers/product";

interface Category {
  categoryId: number;
  categoryName: string;
}

interface ShopCategoryProps {
  getSortParams: (sortType: string, sortValue: string) => void;
  onCategorySelect: (categoryId: number | null) => void;
}

const ShopCategories: React.FC<ShopCategoryProps> = ({ getSortParams, onCategorySelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleCategorySelect = async (categoryId: number | null) => {
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

export default ShopCategories;
