import React, { useEffect, useState } from "react";
import clsx from "clsx";
import BlogFeaturedSingle from "../../components/blog-featured/BlogFeaturedSingle";
import SectionTitle from "../../components/section-title/SectionTitle";
import { getAllBlogs } from "../../utils/BlogService";

interface BlogFeaturedProps {
  spaceBottomClass: string;
  spaceTopClass: string;
};

const BlogFeatured: React.FC<BlogFeaturedProps> = ({ spaceTopClass, spaceBottomClass }) => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all blogs
    getAllBlogs()
      .then(response => {
        const data = response.data; // Accessing data directly from Axios response
        // Sort the blogs by publish date in descending order
        const sortedBlogs = data.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        // Get the latest 3 blogs
        setBlogPosts(sortedBlogs.slice(0, 3));
      })
      .catch(error => console.error('Error fetching blogs:', error));
  }, []);

  return (
    <div className={clsx("blog-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <SectionTitle
          titleText="BÀI VIẾT"
          positionClass="text-center"
          spaceClass="mb-55"
        />
        <div className="row">
          {blogPosts.map(singlePost => (
            <div className="col-lg-4 col-sm-6" key={singlePost.blogId}>
              <BlogFeaturedSingle singlePost={singlePost} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogFeatured;
