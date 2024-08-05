import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { getAllBlogs } from "../../utils/BlogService";
import { getBlogReviewByBlogId } from "../../utils/BlogReviewService";
import BlogPagination from "./BlogPagination"; // Adjust the import path as needed

interface Blog {
  blogId: number;
  imageUrl: string;
  title: string;
  publishDate: string;
  shortDescription: string;
  blogCategoryName: string;
}

interface BlogReview {
  length: number;
}

const BlogPosts: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [comments, setComments] = useState<{ [key: number]: number }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [blogsPerPage] = useState<number>(4);

  useEffect(() => {
    getAllBlogs()
      .then(response => {
        const data: Blog[] = response.data;
        setBlogs(data);
        data.forEach(blog => {
          getBlogReviewByBlogId(blog.blogId)
            .then(response => {
              const commentsData: BlogReview = response.data;
              setComments(prevComments => ({
                ...prevComments,
                [blog.blogId]: commentsData.length
              }));
            })
            .catch(error => console.error('Error fetching comments:', error));
        });
      })
      .catch(error => console.error('Error fetching blogs:', error));
  }, []);

  // Get current blogs for pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <Fragment>
      {currentBlogs.map(blog => (
        <div className="col-lg-6 col-md-6 col-sm-12" key={blog.blogId}>
          <div className="blog-wrap-2 mb-30">
            <div className="blog-img-2">
              <Link to={`/blog-details/${blog.blogId}`}>
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
                    <Link to={`/blog-details/${blog.blogId}`}>
                      {comments[blog.blogId] || 0} <i className="fa fa-comments-o" />
                    </Link>
                  </li>
                </ul>
              </div>
              <h4>
                <Link to={`/blog-details/${blog.blogId}`}>
                  {blog.title}
                </Link>
              </h4>
              <h5>
                Danh mục:{" "}
                <Link to="#">
                  {blog.blogCategoryName}
                </Link>
              </h5>
              <p>{blog.shortDescription}</p>
              <div className="blog-share-comment">
                <div className="blog-btn-2">
                  <Link to={`/blog-details/${blog.blogId}`}>
                    read more
                  </Link>
                </div>
                <div className="blog-share">
                  <span>share :</span>
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
      <BlogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Fragment>
  );
};

export default BlogPosts;
