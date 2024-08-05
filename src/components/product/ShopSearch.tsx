import React from "react";

const ShopSearch = ({ searchTerm, handleSearchChange, handleSubmit }) => {
  return (
    <div className="sidebar-widget">
      <h3 className="pro-sidebar-title">Tìm Kiếm</h3>
      <div className="pro-sidebar-search mb-50 mt-25">
        <form className="pro-sidebar-search-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearchChange}  
          />
          <button disabled={!searchTerm}>
            <i className="pe-7s-search" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSearch;
