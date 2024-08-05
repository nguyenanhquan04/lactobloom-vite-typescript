import React from "react";

const BlogPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  return (
    <div className="pro-pagination-style text-center mt-20">
      <ul>
        <li>
          <button
            className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <i className="fa fa-angle-double-left" />
          </button>
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <li key={index}>
            <button
              className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageClick(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li>
          <button
            className={`next ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <i className="fa fa-angle-double-right" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default BlogPagination;
