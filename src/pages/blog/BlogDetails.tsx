import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
import BlogComment from "../../wrappers/blog/BlogComment";
import BlogPost from "../../wrappers/blog/BlogPost";
import { getBlogByBlogId } from "../../utils/BlogService";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

interface Blog {
  id: number;
  title: string;
  content: string;
  // Add other fields relevant to your Blog object
}

interface DecodedToken {
  role: string;
}

const BlogDetailsStandard: React.FC = () => {
  const { blogId } = useParams<{blogId: string}>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [numericBlogId, setNumericBlogId] = useState<any>(undefined); // State for numericBlogId

  const navigate = useNavigate();

  // Check for authToken cookie and redirect to homepage if the role is not MEMBER
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const userRole = decodedToken.role;
      if (userRole !== "MEMBER") {
        navigate("/admin");
      } 
    }
  }, [navigate]);

  useEffect(() => {
    if (!blogId) {
      setError(new Error("Blog ID is undefined"));
      setLoading(false);
      return;
    }

    const numBlogId = parseInt(blogId, 10);

    if (isNaN(numBlogId)) {
      setError(new Error("Invalid Blog ID"));
      setLoading(false);
      return;
    }

    setNumericBlogId(numBlogId);
    setLoading(true);
    setError(null);

    getBlogByBlogId(numBlogId)
      .then((response) => {
        const data = response.data; 
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
        <Breadcrumb 
          pages={[
            { label: "Trang chủ", path: import.meta.env.VITE_PUBLIC_URL + "/" },
            { label: "Bài Viết", path: import.meta.env.VITE_PUBLIC_URL + "/blog-details/" + blogId }
          ]} 
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row flex-row-reverse">
              <div className="col-lg-9">
                <div className="blog-details-wrapper ml-20">
                  {/* blog post */}
                  {blog && <BlogPost blog={blog} />}
                  {/* blog post comment */}
                  <BlogComment blogId={numericBlogId} />
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
