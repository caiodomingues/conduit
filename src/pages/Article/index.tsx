import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "../../services/api";
import { Article as ArticleProp, UserProps } from "../../types";
import { useAuth } from "../../utils/AuthContext";
import ReactMarkdown from "react-markdown";

interface Author {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}

const Article: React.FC = () => {
  const { id } = useParams<Record<string, string | undefined>>();
  const [article, setArticle] = useState<ArticleProp>();
  const [author, setAuthor] = useState<Author>();
  const [user, setUser] = useState<UserProps>();
  const [comments, setComments] = useState<Comment[]>();
  const [body, setBody] = useState<string>("");
  const { getUser, signed } = useAuth();
  const history = useHistory();

  useEffect((): void => {
    const data = async () => {
      setUser(await getUser!());

      await api
        .get(`articles/${id}/comments`)
        .then((response) => {
          setComments(response.data.comments);
        })
        .catch((error) => {
          console.error(error);
        });

      await api
        .get(`articles/${id}`)
        .then((res) => {
          setArticle(res.data.article);
          setAuthor(res.data.article.author);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    data();
  }, [getUser, id]);

  const getNumberWithOrdinal = (n: number) => {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const handleDelete = async (article: ArticleProp) => {
    await api
      .delete(`articles/${article.slug}`)
      .then(() => {
        history.push("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleFavorite = async (article: ArticleProp) => {
    if (!signed) {
      history.push("/login");
    }

    if (article.favorited) {
      await api
        .delete(`articles/${article.slug}/favorite`)
        .then((response) => {
          setArticle(response.data.article);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await api
        .post(`articles/${article.slug}/favorite`)
        .then((response) => {
          setArticle(response.data.article);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleFollow = async (
    author:
      | { username: string; bio: string; image: string; following: boolean }
      | undefined
  ) => {
    if (author?.following) {
      await api
        .delete(`profiles/${author.username}/follow`)
        .then((response) => {
          setAuthor(response.data.profile);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await api
        .post(`profiles/${author?.username}/follow`)
        .then((response) => {
          setAuthor(response.data.profile);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCommentDelete = async (comment: Comment) => {
    await api
      .delete(`articles/${id}/comments/${comment.id}`)
      .then((response) => {
        let tmp = comments?.filter((com) => {
          return com.id !== comment.id;
        });

        setComments(tmp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleComment = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    await api
      .post(`articles/${id}/comments`, { comment: { body } })
      .then((response) => {
        setBody("");
        if (comments) {
          setComments([...comments, response.data.comment]);
        } else {
          setComments(response.data.comment);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article?.title}</h1>

          <div className="article-meta">
            <Link to={`/@${article?.author.username}`}>
              <img
                alt=""
                src={
                  article?.author.image ||
                  "https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"
                }
              />
            </Link>
            <div className="info">
              <Link to={`/@${article?.author.username}`} className="author">
                {article?.author.username}
              </Link>
              <span className="date">
                {`${getNumberWithOrdinal(
                  new Date(article?.createdAt || "").getDate()
                )} ${new Date(article?.createdAt || "").toLocaleString(
                  "en-US",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )}`}
              </span>
            </div>
            &nbsp;&nbsp;
            {author?.username === user?.username ? (
              <>
                <button
                  onClick={() => history.push(`/editor/${article?.slug}`)}
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i className="ion-edit"></i>
                  &nbsp; Edit article
                </button>
                &nbsp;&nbsp;
                <button
                  onClick={() => handleDelete(article!)}
                  className="btn btn-outline-danger btn-sm"
                >
                  <i className="ion-trash-a"></i> Delete Article
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleFollow(author)}
                  className={`btn btn-sm btn${
                    author?.following ? "-secondary" : "-outline-secondary"
                  } action-btn`}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {author?.following ? "Unfollow" : "Follow"}{" "}
                  {author?.username}
                </button>
                &nbsp;&nbsp;
                <button
                  onClick={() => handleFavorite(article!)}
                  className={`btn btn${
                    !article?.favorited ? "-outline-primary" : "-primary"
                  } btn-sm`}
                >
                  <i className="ion-heart"></i>
                  &nbsp; {article?.favorited ? "Unfavorite" : "Favorite"}
                  <span className="counter">({article?.favoritesCount})</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <ReactMarkdown>{article?.body || ""}</ReactMarkdown>
        </div>

        <hr />

        <div className="article-actions">
          <div className="article-meta">
            <Link to={`/@${article?.author.username}`}>
              <img
                alt=""
                src={
                  article?.author.image ||
                  "https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"
                }
              />
            </Link>
            <div className="info">
              <Link to={`/@${article?.author.username}`} className="author">
                {article?.author.username}
              </Link>
              <span className="date">{`${getNumberWithOrdinal(
                new Date(article?.createdAt || "").getDate()
              )} ${new Date(article?.createdAt || "").toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}`}</span>
            </div>
            {author?.username === user?.username ? (
              <>
                <button
                  onClick={() => history.push(`/editor/${article?.slug}`)}
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i className="ion-edit"></i>
                  &nbsp; Edit article
                </button>
                &nbsp;&nbsp;
                <button
                  onClick={() => handleDelete(article!)}
                  className="btn btn-outline-danger btn-sm"
                >
                  <i className="ion-trash-a"></i> Delete Article
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleFollow(author)}
                  className={`btn btn-sm btn${
                    author?.following ? "-secondary" : "-outline-secondary"
                  } action-btn`}
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {author?.following ? "Unfollow" : "Follow"}{" "}
                  {author?.username}
                </button>
                &nbsp;&nbsp;
                <button
                  onClick={() => handleFavorite(article!)}
                  className={`btn btn${
                    !article?.favorited ? "-outline-primary" : "-primary"
                  } btn-sm`}
                >
                  <i className="ion-heart"></i>
                  &nbsp; {article?.favorited ? "Unfavorite" : "Favorite"}
                  <span className="counter">({article?.favoritesCount})</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form onSubmit={handleComment} className="card comment-form">
              <div className="card-block">
                <textarea
                  className="form-control"
                  placeholder="Write a comment..."
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                ></textarea>
              </div>
              <div className="card-footer">
                <img
                  alt=""
                  src={
                    user?.image ||
                    "https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"
                  }
                  className="comment-author-img"
                />
                <button className="btn btn-sm btn-primary">Post Comment</button>
              </div>
            </form>

            {comments?.map((comment) => (
              <div key={comment.id} className="card">
                <div className="card-block">
                  <p className="card-text">{comment.body}</p>
                </div>
                <div className="card-footer">
                  <Link
                    to={`/@${comment.author.username}`}
                    className="comment-author"
                  >
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
                  <Link
                    to={`/@${comment.author.username}`}
                    className="comment-author"
                  >
                    {comment.author.username}
                  </Link>
                  <span className="date-posted">{`${getNumberWithOrdinal(
                    new Date(article?.createdAt || "").getDate()
                  )} ${new Date(article?.createdAt || "").toLocaleString(
                    "en-US",
                    {
                      month: "long",
                    }
                  )}`}</span>
                  <span className="mod-options">
                    <i
                      className="ion-trash-a"
                      onClick={() => handleCommentDelete(comment)}
                    ></i>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
