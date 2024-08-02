// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { getAllBlogs } from "../../utils/BlogService";
// import { getAllBlogCategories } from "../../utils/BlogCategoryService";

// const BlogSidebar = () => {
//   const [latestBlogs, setLatestBlogs] = useState([]);
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     // Fetch latest blogs
//     getAllBlogs()
//       .then(response => {
//         const data = response.data; // Accessing data directly from Axios response
//         // Sort blogs by publishDate in descending order to get the latest posts
//         const sortedBlogs = data.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
//         // Get the top 4 latest posts
//         setLatestBlogs(sortedBlogs.slice(0, 4));
//       })
//       .catch(error => console.error('Error fetching latest blogs:', error));

//     // Fetch blog categories
//     getAllBlogCategories()
//       .then(response => {
//         const data = response.data; // Accessing data directly from Axios response
//         setCategories(data);
//       })
//       .catch(error => console.error('Error fetching categories:', error));
//   }, []);

//   return (
//     <div className="sidebar-style">
//       <div className="sidebar-widget">
//         <h4 className="pro-sidebar-title">Search </h4>
//         <div className="pro-sidebar-search mb-55 mt-25">
//           <form className="pro-sidebar-search-form" action="#">
//             <input type="text" placeholder="Search here..." />
//             <button>
//               <i className="pe-7s-search" />
//             </button>
//           </form>
//         </div>
//       </div>
//       <div className="sidebar-widget">
//         <h4 className="pro-sidebar-title">Recent Blogs </h4>
//         <div className="sidebar-project-wrap mt-30">
//           {latestBlogs.map(blog => (
//             <div className="single-sidebar-blog" key={blog.blogId}>
//               <div className="sidebar-blog-img">
//                 <Link to={`${import.meta.env.VITE_PUBLIC_URL}/blog-details/${blog.blogId}`}>
//                   <img
//                     src={blog.imageUrl}
//                     alt={blog.title}
//                   />
//                 </Link>
//               </div>
//               <div className="sidebar-blog-content">
//                 <span>{blog.category}</span>
//                 <h4>
//                   <Link to={`${import.meta.env.VITE_PUBLIC_URL}/blog-details/${blog.blogId}`}>
//                     {blog.title}
//                   </Link>
//                 </h4>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="sidebar-widget mt-35">
//         <h4 className="pro-sidebar-title">Categories</h4>
//         <div className="sidebar-widget-list sidebar-widget-list--blog mt-20">
//           <ul>
//             {categories.map(category => (
//               <li key={category.blogCategoryId}>
//                 <div className="sidebar-widget-list-left">
//                   <input type="checkbox" defaultValue />{" "}
//                   <Link>
//                     {category.blogCategoryName}{" "}
//                   </Link>
//                   <span className="checkmark" />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogSidebar;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllBlogs } from "../../utils/BlogService";
import { getAllBlogCategories } from "../../utils/BlogCategoryService";

const BlogSidebar = () => {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    // Fetch latest blogs
    getAllBlogs()
      .then(response => {
        const data = response.data;
        const sortedBlogs = data.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        setLatestBlogs(sortedBlogs.slice(0, 4));
      })
      .catch(error => console.error('Error fetching latest blogs:', error));

    // Fetch blog categories
    getAllBlogCategories()
      .then(response => {
        const data = response.data;
        setCategories(data);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/blog?search=${searchTerm}`);
  };

  return (
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
                  <img src={blog.imageUrl} alt={blog.title} />
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
    </div>
  );
};

export default BlogSidebar;
