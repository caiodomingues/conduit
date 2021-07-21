import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../services/api";
import { Article } from "../../types";
import { useAuth } from "../../utils/AuthContext";

const Home: React.FC = () => {
  const [tags, setTags] = useState([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [feed, setFeed] = useState<Article[]>([]);
  const [feedActive, setFeedActive] = useState(false);
  const [selectedPage, setSelectedPage] = useState(0);
  const { signed } = useAuth();
  const token = localStorage.getItem("conduit_token");
  const history = useHistory();

  useEffect(() => {
    const data = async () => {
      await api
        .get("tags")
        .then((response) => {
          setTags(response.data.tags);
        })
        .catch((error) => {
          console.log(error);
        });

      await api
        .get("articles?limit=10&offset=0")
        .then((response) => {
          let tmp = response.data.articles;
          tmp.sort((a: Article, b: Article) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
          setArticles(tmp);
        })
        .catch((error) => {
          console.log(error);
        });

      await api
        .get("articles/feed?limit=10&offset=0", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          let tmp = response.data.articles;
          tmp.sort((a: Article, b: Article) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
          setFeed(tmp);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    data();
  }, [token]);

  const getNumberWithOrdinal = (n: number) => {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const handlePage = async (index: number) => {
    setArticles([]);
    await api
      .get(`articles?limit=10&offset=${index * 10}`)
      .then((response) => {
        let tmp = response.data.articles;
        tmp.sort((a: Article, b: Article) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
        setArticles(tmp);
        setSelectedPage(index);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFavorite = (article: Article) => {
    if (!signed) {
      history.push("/login");
    }

    if (article.favorited) {
      api
        .delete(`articles/${article.slug}/favorite`)
        .then((response) => {
          article.favorited = false;
          let tmp = articles.filter((art) => {
            return art.slug !== article.slug;
          });
          tmp.push(response.data.article);
          tmp.sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });

          setArticles(tmp);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      api
        .post(`articles/${article.slug}/favorite`)
        .then((response) => {
          article.favorited = true;
          let tmp = articles.filter((art) => {
            return art.slug !== article.slug;
          });
          tmp.push(response.data.article);
          tmp.sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });

          setArticles(tmp);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {signed && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${feedActive ? "active" : ""}`}
                      to="#"
                      onClick={() => setFeedActive(true)}
                    >
                      Your Feed
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link
                    className={`nav-link ${!feedActive ? "active" : ""}`}
                    onClick={() => setFeedActive(false)}
                    to="#"
                  >
                    Global Feed
                  </Link>
                </li>
              </ul>
            </div>

            {!feedActive ? (
              <>
                {articles.length === 0 ? (
                  <div className="article-preview">Loading articles...</div>
                ) : (
                  articles.map((article) => (
                    <div key={article.slug} className="article-preview">
                      <div className="article-meta">
                        <Link to={`/@${article.author.username}`}>
                          <img
                            alt={`${article.author.image} profile`}
                            src={
                              article.author.image ||
                              "https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"
                            }
                          />
                        </Link>
                        <div className="info">
                          <Link
                            to={`/@${article.author.username}`}
                            className="author"
                          >
                            {article.author.username}
                          </Link>
                          <span className="date">
                            {`${getNumberWithOrdinal(
                              new Date(article.createdAt).getDate()
                            )} 
                          ${new Date(article.createdAt).toLocaleString(
                            "en-US",
                            {
                              month: "long",
                            }
                          )}`}
                          </span>
                        </div>
                        <button
                          onClick={() => handleFavorite(article)}
                          className={`btn btn${
                            !article.favorited ? "-outline-primary" : "-primary"
                          } btn-sm pull-xs-right`}
                        >
                          <i className="ion-heart"></i> {article.favoritesCount}
                        </button>
                      </div>
                      <Link
                        to={`article/${article.slug}`}
                        className="preview-link"
                      >
                        <h1>{article.title}</h1>
                        <p>{article.description}</p>
                        <span>Read more...</span>
                        <ul className="tag-list">
                          {article.tagList.map((tag) => (
                            <li
                              key={tag}
                              className="tag-default tag-pill tag-outline ng-binding ng-scope"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </Link>
                    </div>
                  ))
                )}
              </>
            ) : (
              <>
                {feed.length === 0 ? (
                  <div className="article-preview">
                    No articles are here... yet
                  </div>
                ) : (
                  feed.map((article) => (
                    <div key={article.slug} className="article-preview">
                      <div className="article-meta">
                        <Link to={`/@${article.author.username}`}>
                          <img
                            alt={`${article.author.image} profile`}
                            src={
                              article.author.image ||
                              "https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"
                            }
                          />
                        </Link>
                        <div className="info">
                          <Link
                            to={`/@${article.author.username}`}
                            className="author"
                          >
                            {article.author.username}
                          </Link>
                          <span className="date">
                            {`${getNumberWithOrdinal(
                              new Date(article.createdAt).getDate()
                            )} 
                          ${new Date(article.createdAt).toLocaleString(
                            "en-US",
                            {
                              month: "long",
                            }
                          )}`}
                          </span>
                        </div>
                        <button
                          onClick={() => handleFavorite(article)}
                          className={`btn btn${
                            !article.favorited ? "-outline-primary" : "-primary"
                          } btn-sm pull-xs-right`}
                        >
                          <i className="ion-heart"></i> {article.favoritesCount}
                        </button>
                      </div>
                      <Link
                        to={`/article/${article.slug}`}
                        className="preview-link"
                      >
                        <h1>{article.title}</h1>
                        <p>{article.description}</p>
                        <span>Read more...</span>
                        <ul className="tag-list">
                          {article.tagList.map((tag) => (
                            <li
                              key={tag}
                              className="tag-default tag-pill tag-outline ng-binding ng-scope"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </Link>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                {tags.length === 0 ? (
                  <p>Loading tags...</p>
                ) : (
                  tags.map((tag) => (
                    <Link key={tag} to="" className="tag-pill tag-default">
                      {tag}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          {!feedActive && (
            <div className="col-md-9">
              <nav>
                <ul className="pagination">
                  {[...Array(50)].map((page, index) => (
                    <li
                      className={`page-item ${
                        selectedPage === index ? "active" : ""
                      }`}
                      key={index}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePage(index + 1)}
                      >
                        {index}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
