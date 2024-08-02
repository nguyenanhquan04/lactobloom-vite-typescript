import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
import BlogComment from "../../wrappers/blog/BlogComment";
import BlogPost from "../../wrappers/blog/BlogPost";
import { getBlogByBlogId } from "../../utils/BlogService";
import Cookies from "js-cookie"; // Import js-cookie
import {jwtDecode} from "jwt-decode";

const BlogDetailsStandard = () => {
  let { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    setLoading(true);
    setError(null);

    getBlogByBlogId(blogId)
      .then((response) => {
        const data = response.data; // Accessing data directly from Axios response
        setBlog(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [blogId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Fragment>
      <SEO
        titleTemplate="Blog Post"
        description="Lactobloom Blog Post Page."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            { label: "Trang chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            { label: "Blog Post", path: import.meta.env.VITE_PUBLIC_URL + "/blog-details/" + blogId }
          ]} 
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row flex-row-reverse">
              <div className="col-lg-9">
                <div className="blog-details-wrapper ml-20">
                  {/* blog post */}
                  <BlogPost blog={blog} />

                  {/* blog post comment */}
                  <BlogComment blogId={blogId} />
                </div>
              </div>
              <div className="col-lg-3">
                {/* blog sidebar */}
                <BlogSidebar />
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default BlogDetailsStandard;
