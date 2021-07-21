import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../services/api";
import { Article } from "../../types";
import { useAuth } from "../../utils/AuthContext";

interface ArticleCardProps {
  initialArticle: Article;
  key: string;
}

function ArticleCard({ initialArticle }: ArticleCardProps) {
  const { signed } = useAuth();
  const history = useHistory();
  const [article, setArticle] = useState<Article>(initialArticle);

  const getNumberWithOrdinal = (n: number) => {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
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
          setArticle(response.data.article);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      api
        .post(`articles/${article.slug}/favorite`)
        .then((response) => {
          article.favorited = true;
          setArticle(response.data.article);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
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
          <Link to={`/@${article.author.username}`} className="author">
            {article.author.username}
          </Link>
          <span className="date">
            {`${getNumberWithOrdinal(new Date(article.createdAt).getDate())} 
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
      <Link to={`article/${article.slug}`} className="preview-link">
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
  );
}

export default ArticleCard;
