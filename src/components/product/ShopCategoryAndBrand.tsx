import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../utils/CategoryService";
import { getAllBrands } from "../../utils/BrandService";
import { setActiveSort } from "../../helpers/product";

interface Brand {
  brandId: number;
  brandName: string;
}

interface Category {
  categoryId: number;
  categoryName: string;
}

interface ShopCategoryAndBrandProps {
  onBrandSelect: (brandId: number | null) => void;
  onCategorySelect: (categoryId: number | null) => void;
}

const ShopCategoryAndBrand: React.FC<ShopCategoryAndBrandProps> = ({
  onCategorySelect,
  onBrandSelect,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
  const [errorBrands, setErrorBrands] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error: any) {
        setErrorCategories(error.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        setBrands(response.data);
      } catch (error: any) {
        setErrorBrands(error.message);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchCategories();
    fetchBrands();
  }, []);

  const handleAllCategories = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedCategories([]);
    onCategorySelect(null);
    setActiveSort(e, "category");
  };

  const handleAllBrands = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedBrands([]);
    onBrandSelect(null);
    setActiveSort(e, "brand");
  };

  const handleCategorySelect = (categoryId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (categoryId === null) {
      setSelectedCategories([]);
      onCategorySelect(null);
    } else {
      setSelectedCategories([categoryId]);
      onCategorySelect(categoryId);
    }
    setActiveSort(e, "category");
  };

  const handleBrandSelect = (brandId: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (brandId === null) {
      setSelectedBrands([]);
      onBrandSelect(null);
    } else {
      setSelectedBrands([brandId]);
      onBrandSelect(brandId);
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

export default ShopCategoryAndBrand;
