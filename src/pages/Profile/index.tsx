import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import ArticleCard from "../../components/ArticleCard";
import api from "../../services/api";
import { Article, UserProps } from "../../types";
import { useAuth } from "../../utils/AuthContext";

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProps>();
  const [localUser, setLocalUser] = useState<UserProps>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [likedArticles, setLikedArticles] = useState<Article[]>([]);
  const [likedActive, setLikedActive] = useState<boolean>(false);
  const { getUser, signed } = useAuth();
  const history = useHistory();

  const { id } = useParams<Record<string, string | undefined>>();

  useEffect((): void => {
    const data = async () => {
      setLocalUser(await getUser!());

      await api
        .get(`profiles/${id}`)
        .then((response) => {
          setUser(response.data.profile);
        })
        .catch((err) => {
          console.log(err);
        });

      await api
        .get(`articles?limit=10&offset=0&favorited=${user?.username}`)
        .then((response) => {
          let tmp = response.data.articles;
          tmp.sort((a: Article, b: Article) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
          setLikedArticles(tmp);
        })
        .catch((error) => {
          console.log(error);
        });

      await api
        .get(`articles?limit=10&offset=0&author=${user?.username}`)
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
    };

    data();
  }, [getUser, id, user?.username]);

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

  const getNumberWithOrdinal = (n: number) => {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const handleFollow = (user: UserProps) => {
    if (user.following) {
      api
        .delete(`profiles/${user.username}/follow`)
        .then((response) => {
          setUser(response.data.profile);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .post(`profiles/${user.username}/follow`)
        .then((response) => {
          setUser(response.data.profile);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img
                alt={`${user?.username} profile`}
                src={
                  user?.image ||
                  "https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg"
                }
                className="user-img"
              />
              <h4>{user?.username}</h4>
              <p>{user?.bio}</p>
              {localUser?.username === user?.username ? (
                <Link
                  to="/settings"
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i className="ion-gear-a"></i>
                  &nbsp; Edit Profile Settings
                </Link>
              ) : (
                <button
                  onClick={() => handleFollow(user!)}
                  className="btn btn-sm btn-outline-secondary action-btn"
                >
                  <i className="ion-plus-round"></i>
                  &nbsp; {user?.following ? "Unfollow" : "Follow"}{" "}
                  {user?.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${!likedActive ? "active" : ""}`}
                    to="#"
                    onClick={() => setLikedActive(false)}
                  >
                    My Articles
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${likedActive ? "active" : ""}`}
                    onClick={() => setLikedActive(true)}
                    to="#"
                  >
                    Favorited Articles
                  </Link>
                </li>
              </ul>
            </div>

            {!likedActive ? (
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
                {likedArticles.length === 0 ? (
                  <div className="article-preview">
                    No articles are here... yet
                  </div>
                ) : (
                  likedArticles.map((article) => (
                    <ArticleCard key={article.slug} initialArticle={article} />
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
