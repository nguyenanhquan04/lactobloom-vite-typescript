import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { getAllBlogs, getBlogByBlogCategoryId, searchBlog } from "../../utils/BlogService";
import { getAllBlogCategories } from "../../utils/BlogCategoryService";
import { getBlogReviewByBlogId } from "../../utils/BlogReviewService";
import BlogPagination from "../../wrappers/blog/BlogPagination"; // Adjust the import path as needed

import Cookies from "js-cookie"; // Import js-cookie
import {jwtDecode} from "jwt-decode";

const BlogStandard = () => {
  let { pathname, search } = useLocation();
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [comments, setComments] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState(new URLSearchParams(search).get("search") || "");

  let navigate = useNavigate();
    // Check for authToken cookie and redirect to homepage if it exists
    useEffect(() => {
      const token = Cookies.get("authToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;
        if (userRole !== "MEMBER") {
          navigate("/admin");
        } 
      }
    }, [navigate]);

  useEffect(() => {
    console.log(searchTerm);
    // Fetch all blogs and categories initially
    const fetchData = async () => {
      try {
        const [blogsResponse, categoriesResponse] = await Promise.all([
          getAllBlogs(),
          getAllBlogCategories()
        ]);

        const blogsData = blogsResponse.data;
        const categoriesData = categoriesResponse.data;

        // Sort blogs by publishDate in descending order to get the latest posts
        const sortedBlogs = blogsData.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        // Get the top 4 latest posts
        setLatestBlogs(sortedBlogs.slice(0, 4));
        setBlogs(blogsData);
        setFilteredBlogs(blogsData);

        // Fetch comments for each blog
        blogsData.forEach(blog => {
          getBlogReviewByBlogId(blog.blogId)
            .then(response => {
              const commentsData = response.data;
              setComments(prevComments => ({
                ...prevComments,
                [blog.blogId]: commentsData.length
              }));
            })
            .catch(error => console.error('Error fetching comments:', error));
        });

        setCategories(categoriesData);
        applyFilters(searchTerm);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    applyFilters(searchTerm, categoryId);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/blog?search=${searchTerm}`);
    applyFilters(searchTerm, selectedCategory);
  };

  const applyFilters = (searchTerm, categoryId) => {
    // Fetch blogs based on search term
    searchBlog(searchTerm)
      .then(response => {
        const searchResults = response.data;
        if (categoryId === "all" || categoryId === null || categoryId === undefined) {
          setFilteredBlogs(searchResults);
        } else {
          // Fetch blogs by selected category
          getBlogByBlogCategoryId(categoryId)
            .then(response => {
              const categoryBlogs = response.data;
              // Filter search results by category
              filterBlogs(searchResults, categoryBlogs);
            })
            .catch(error => console.error('Error fetching blogs by category:', error));
        }
      })
      .catch(error => console.error('Error fetching blogs by search:', error));
  };

  const filterBlogs = (searchResults, categoryBlogs) => {
    if (categoryBlogs) {
      // Get blogIds that are present in both searchResults and categoryBlogs
      const categoryBlogIds = new Set(categoryBlogs.map(blog => blog.blogId));
      const filteredByCategoryAndSearch = searchResults.filter(blog => categoryBlogIds.has(blog.blogId));
      setFilteredBlogs(filteredByCategoryAndSearch);
    } else {
      setFilteredBlogs(searchResults);
    }
  };

  // Get current blogs for pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return (
    <Fragment>
      <SEO
        titleTemplate="Blog"
        description="Lactobloom Blog Page."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Trang Chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            {label: "Bài viết", path: import.meta.env.VITE_PUBLIC_URL + pathname }
          ]} 
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row flex-row-reverse">
              <div className="col-lg-9">
                <div className="ml-20">
                  <div className="row">
                    {currentBlogs.map(blog => (
                      <div className="col-lg-6 col-md-6 col-sm-12" key={blog.blogId}>
                        <div className="blog-wrap-2 mb-30">
                          <div className="blog-img-2">
                            <Link to={`${import.meta.env.VITE_PUBLIC_URL}/blog-details/${blog.blogId}`}>
                              <img
                                src={blog.imageUrl}
                                alt={blog.title}
                              />
                            </Link>
                          </div>
                          <div className="blog-content-2">
                            <div className="blog-meta-2">
                              <ul>
                                <li>{new Date(blog.publishDate).toLocaleDateString()}</li>
                                <li>
                                  <Link to={`${import.meta.env.VITE_PUBLIC_URL}/blog-details/${blog.blogId}`}>
                                    {comments[blog.blogId] || 0} <i className="fa fa-comments-o" />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <h4>
                              <Link to={`${import.meta.env.VITE_PUBLIC_URL}/blog-details/${blog.blogId}`}>
                                {blog.title}
                              </Link>
                            </h4>
                            <h5>
                              Danh mục:{" "}
                              <Link>
                                {blog.blogCategoryName}
                              </Link>
                            </h5>
                            <p>{blog.shortDescription}</p>
                            <div className="blog-share-comment">
                              <div className="blog-btn-2">
                                <Link to={`${import.meta.env.VITE_PUBLIC_URL}/blog-details/${blog.blogId}`}>
                                  Đọc thêm
                                </Link>
                              </div>
                              <div className="blog-share">
                                <span>chia sẻ :</span>
                                <div className="share-social">
                                  <ul>
                                    <li>
                                      <a className="facebook" href="//facebook.com">
                                        <i className="fa fa-facebook" />
                                      </a>
                                    </li>
                                    <li>
                                      <a className="twitter" href="//twitter.com">
                                        <i className="fa fa-twitter" />
                                      </a>
                                    </li>
                                    <li>
                                      <a className="instagram" href="//instagram.com">
                                        <i className="fa fa-instagram" />
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <BlogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="sidebar-style">
                  <div className="sidebar-widget">
                    <h4 className="pro-sidebar-title">Tìm kiếm </h4>
                    <div className="pro-sidebar-search mb-55 mt-25">
                      <form className="pro-sidebar-search-form" onSubmit={handleSearch}>
                        <input 
                          type="text" 
                          placeholder="Tìm kiếm..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit">
                          <i className="pe-7s-search" />
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="sidebar-widget">
                    <h4 className="pro-sidebar-title">Bài viết gần đây </h4>
                    <div className="sidebar-project-wrap mt-30">
                      {latestBlogs.map(blog => (
                        <div className="single-sidebar-blog" key={blog.blogId}>
                          <div className="sidebar-blog-img">
                            <Link to={`${import.meta.env.VITE_PUBLIC_URL}/blog-details/${blog.blogId}`}>
                              <img
                                src={blog.imageUrl}
                                alt={blog.title}
                              />
                            </Link>
                          </div>
                          <div className="sidebar-blog-content">
                            <span>{blog.category}</span>
                            <h4>
                              <Link to={`${import.meta.env.VITE_PUBLIC_URL}/blog-details/${blog.blogId}`}>
                                {blog.title}
                              </Link>
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="sidebar-widget mt-35">
                    <h4 className="pro-sidebar-title">Danh mục</h4>
                    <div className="sidebar-widget-list sidebar-widget-list--blog mt-20">
                      <ul>
                        <li>
                          <div className="sidebar-widget-list-left">
                            <input
                              type="radio"
                              id="all-categories"
                              name="category"
                              value="all"
                              checked={selectedCategory === "all"}
                              onChange={() => handleCategoryChange("all")}
                            />
                            <Link>
                              Tất cả danh mục
                            </Link>
                            <span className="checkmark" />
                          </div>
                        </li>
                        {categories.map(category => (
                          <li key={category.blogCategoryId}>
                            <div className="sidebar-widget-list-left">
                              <input
                                type="radio"
                                id={`category-${category.blogCategoryId}`}
                                name="category"
                                value={category.blogCategoryId}
                                checked={selectedCategory === category.blogCategoryId}
                                onChange={() => handleCategoryChange(category.blogCategoryId)}
                              />
                              <Link>
                                {category.blogCategoryName}
                              </Link>
                              <span className="checkmark" />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default BlogStandard;
