import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticleCard from "../../components/ArticleCard";
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
                    <ArticleCard key={article.slug} initialArticle={article} />
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
                    <ArticleCard key={article.slug} initialArticle={article} />
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
