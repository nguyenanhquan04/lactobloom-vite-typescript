import React from "react";

interface ProductImageGalleryStickyProps {
  product?: any;
};

const productImageGallerySticky: React.FC<ProductImageGalleryStickyProps> = ({ product }) => {
  return (
    <div className="product-large-image-wrapper product-large-image-wrapper--sticky">
      {product.discount || product.new ? (
        <div className="product-img-badges">
          {product.discount ? (
            <span className="pink">-{product.discount}%</span>
          ) : (
            ""
          )}
          {product.new ? <span className="purple">New</span> : ""}
        </div>
      ) : (
        ""
      )}
      <div className="product-sticky-image mb--10">
        {product?.image?.map((single: any, key: any) => (
          <div className="product-sticky-image__single mb-10" key={key}>
            <img
              src={import.meta.env.VITE_PUBLIC_URL + single}
              alt=""
              className="img-fluid"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default productImageGallerySticky;
