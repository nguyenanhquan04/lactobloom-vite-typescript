import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { deleteBlogReview, getBlogReviewByBlogId, saveBlogReview, updateBlogReview } from "../../utils/BlogReviewService";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

interface Comment {
  reviewId: number;
  comment: string;
  reviewDate: string;
  email: string;
}

interface DecodedToken {
  sub: string; // Assuming 'sub' contains the email
}

interface BlogCommentProps {
  blogId: number;
}

const BlogComment: React.FC<BlogCommentProps> = ({ blogId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newReview, setNewReview] = useState({ comment: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [actionCommentId, setActionCommentId] = useState<number | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setAuthEmail(decodedToken.sub);
    }
  }, []);

  useEffect(() => {

    setLoading(true);
    setError(null);

    getBlogReviewByBlogId(blogId)
      .then((response) => {
        setComments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [blogId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!blogId) return;
    const currentDate = new Date();
    const localDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000);
    const formattedDate = localDate.toISOString().slice(0, 19);

    const reviewData = {
      comment: newReview.comment,
      reviewDate: formattedDate,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${Cookies.get("authToken")}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await saveBlogReview(blogId, reviewData, config);
      setComments([...comments, response.data]);
      setNewReview({ comment: "" });
    } catch (error) {
      console.error("Error submitting the review:", error);
    }
  };

  const handleActionButtonClick = (reviewId: number) => {
    setActionCommentId(actionCommentId === reviewId ? null : reviewId);
  };

  const handleEditClick = (reviewId: number, currentComment: string) => {
    setEditCommentId(reviewId);
    setEditedComment(currentComment);
  };

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditedComment("");
  };

  const handleUpdateClick = async (reviewId: number) => {
    const config = {
      headers: {
        Authorization: `Bearer ${Cookies.get("authToken")}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await updateBlogReview(reviewId, { comment: editedComment }, config);
      setComments(comments.map(comment => comment.reviewId === reviewId ? response.data : comment));
      setEditCommentId(null);
      setEditedComment("");
    } catch (error) {
      console.error("Error updating the comment:", error);
    }
  };

  const handleDeleteClick = async (reviewId: number) => {
    const config = {
      headers: {
        Authorization: `Bearer ${Cookies.get("authToken")}`,
        "Content-Type": "application/json",
      },
    };

    try {
      await deleteBlogReview(reviewId, config);
      setComments(comments.filter((comment) => comment.reviewId !== reviewId));
    } catch (error) {
      console.error("Error deleting the comment:", error);
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Fragment>
      <div className="blog-comment-wrapper mt-55">
        <h4 className="blog-dec-title">comments : {comments.length}</h4>
        {comments.map((comment) => (
          <div key={comment.reviewId} className="single-comment-wrapper mt-35">
            <div className="blog-comment-img">
              <img src={"/assets/img/user.jpg"} alt="" />
            </div>
            <div className="blog-comment-content">
              <div className="comment-header">
                <h4>{comment.email}</h4>
                <span>{new Date(comment.reviewDate).toLocaleDateString()}</span>
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  className="more-options-icon"
                  onClick={() => handleActionButtonClick(comment.reviewId)}
                />
              </div>
              {editCommentId === comment.reviewId ? (
                <div className="edit-comment">
                  <textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                  />
                  <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                  <button className="update-button" onClick={() => handleUpdateClick(comment.reviewId)}>Update</button>
                </div>
              ) : (
                <p>{comment.comment}</p>
              )}
              {authEmail === comment.email && actionCommentId === comment.reviewId && (
                <div className="action-buttons">
                  {editCommentId !== comment.reviewId && (
                    <>
                      <button onClick={() => handleEditClick(comment.reviewId, comment.comment)}>
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button onClick={() => handleDeleteClick(comment.reviewId)}>
                        <FontAwesomeIcon icon={faTrashAlt} /> Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="blog-reply-wrapper mt-50">
        <h4 className="blog-dec-title">post a comment</h4>
        {Cookies.get("authToken") ? (
          <form className="blog-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <div className="text-leave">
                  <textarea
                    placeholder="Message"
                    name="comment"
                    value={newReview.comment}
                    onChange={handleInputChange}
                  />
                  <input type="submit" value="Submit" />
                </div>
              </div>
            </div>
          </form>
        ) : (
          <p className="login-required">Phải đăng nhập để bình luận.</p>
        )}
      </div>
    </Fragment>
  );
};

export default BlogComment;
