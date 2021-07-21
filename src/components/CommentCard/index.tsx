import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Article, Comment } from "../../types";

interface CommentCardProps {
  initialComment: Comment;
  article: Article;
  key: number;
  handleCommentDelete: (comment: Comment) => void;
}

function CommentCard({
  initialComment,
  article,
  handleCommentDelete,
}: CommentCardProps) {
  const [comment, setComment] = useState<Comment>(initialComment);

  const getNumberWithOrdinal = (n: number) => {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div key={comment.id} className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link to={`/@${comment.author.username}`} className="comment-author">
          <img
            alt=""
            src={
              comment.author.image ||
              "https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"
            }
            className="comment-author-img"
          />
        </Link>
        &nbsp;
        <Link to={`/@${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">{`${getNumberWithOrdinal(
          new Date(article?.createdAt || "").getDate()
        )} ${new Date(article?.createdAt || "").toLocaleString("en-US", {
          month: "long",
        })}`}</span>
        <span className="mod-options">
          <i
            className="ion-trash-a"
            onClick={() => handleCommentDelete(comment)}
          ></i>
        </span>
      </div>
    </div>
  );
}

export default CommentCard;
