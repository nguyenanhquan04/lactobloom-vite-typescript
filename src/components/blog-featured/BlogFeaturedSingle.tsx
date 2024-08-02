import { useNavigate } from "react-router-dom";
import React from "react";

interface BlogFeaturedSingleProps {
  singlePost: {
    blogId : number;
    imageUrl: string;
    title: string
  }
}

const BlogFeaturedSingle: React.FC<BlogFeaturedSingleProps> = ({ singlePost }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/blog-details/"+ singlePost.blogId)
  };
  return (
    <div className="blog-wrap mb-30 scroll-zoom">
      <div className="blog-img">
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                <img src={singlePost.imageUrl} alt="" />
            </div>
      </div>
      <div className="blog-content-wrap">
        <div className="blog-content text-center">
          <h3>
            <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                {singlePost.title}
            </div>
          </h3>
          <span>
            By Admin
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogFeaturedSingle;
