import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import api from "../../services/api";
import { UserProps } from "../../types";
import { useAuth } from "../../utils/AuthContext";

const Editor: React.FC = () => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const { getUser } = useAuth();
  const [user, setUser] = useState<UserProps>();

  const history = useHistory();
  const { slug } = useParams<Record<string, string | undefined>>();

  useEffect(() => {
    const data = async () => {
      setUser(await getUser!());

      await api
        .get(`articles/${slug}`)
        .then((response) => {
          if (response.data.article.author.username !== user?.username) {
            history.push("/editor");
          }

          let tags = response.data.article.tagList.join().replace(",", " ");

          setTitle(response.data.article.title);
          setAbout(response.data.article.description);
          setContent(response.data.article.body);
          setTags(tags);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    if (slug) {
      data();
    }
  }, [getUser, history, slug, user?.username]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (slug) {
      await api
        .put(`articles/${slug}`, {
          article: {
            title,
            description: about,
            body: content,
            tagList: tags.split(" "),
          },
        })
        .then((response) => {
          setTitle("");
          setAbout("");
          setContent("");
          setTags("");
          history.push("/article/" + response.data.article.slug);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await api
        .post("articles", {
          article: {
            title,
            description: about,
            body: content,
            tagList: tags.split(" "),
          },
        })
        .then((response) => {
          setTitle("");
          setAbout("");
          setContent("");
          setTags("");
          history.push("article/" + response.data.article.slug);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    defaultValue={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <div className="tag-list"></div>
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
