import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useGetPosts } from "../../hooks/posts/useGetPosts.js";

const Posts = ({ feedType }) => {

  const { data: posts = [], isLoading, isRefetching } = useGetPosts(feedType);

  const { data: POSTS } = posts;

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && POSTS?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && POSTS && (
        <div>
          {POSTS.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
