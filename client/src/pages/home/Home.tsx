import { useEffect } from "react";
import Page from "../../components/Page";
import { convertStyleToReact } from "../../utils/helper.function";
import "./home.css";
import { useAppSelector } from "src/redux/hooks";
import PostComponent from "components/PostComponent";
import CreatePostComponent from "components/CreatePostComponent";
import { orderBy } from "lodash";

export default function Home() {
  const { posts } = useAppSelector((state) => ({
    posts: state.posts.posts,
  }));
  useEffect(() => {
    convertStyleToReact(
      "border-bottom-width: 1px;border-bottom-color: var(--bs-navbar-active-color);"
    );
  }, []);
  return (
    <Page title="Home">
      <div className="container">
        <CreatePostComponent />
        {orderBy(posts, "timestamp", "desc").map((post, index) => (
          <PostComponent key={index} {...post} index={index} />
        ))}
      </div>
    </Page>
  );
}
