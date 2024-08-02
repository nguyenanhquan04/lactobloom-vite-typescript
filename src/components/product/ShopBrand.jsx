import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getAllBrands } from "../../utils/BrandService";
import { setActiveSort } from "../../helpers/product";

const ShopBrand = ({ getSortParams, onBrandSelect }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        setBrands(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandSelect = async (brandId) => {
    onBrandSelect(brandId);
  };


  return (
    <div className="sidebar-widget mt-50">
      <h4 className="pro-sidebar-title">Brand </h4>
      <div className="sidebar-widget-list mt-25">
        {loading ? (
          "Loading brands..."
        ) : error ? (
          `Error: ${error}`
        ) : brands && brands.length > 0 ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  onClick={e => {
                    getSortParams("brand", "");
                    handleBrandSelect(null);
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> All Brands{" "}
                </button>
              </div>
            </li>
            {brands.map((brand) => (
              <li key={brand.brandId}>
                <div className="sidebar-widget-list-left">
                  <button
                    onClick={e => {
                      handleBrandSelect(brand.brandId)
                      setActiveSort(e);
                    }}
                  >
                    <span className="checkmark" /> {brand.brandName}{" "}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          "No brand found"
        )}
      </div>
    </div>
  );
};


ShopBrand.propTypes = {
  getSortParams: PropTypes.func,
  onBrandSelect: PropTypes.func
};

export default ShopBrand;
