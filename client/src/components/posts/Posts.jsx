import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";

const Posts = ({ userId }) => {
  // Construire l'URL selon si on affiche tous les posts ou ceux d'un utilisateur
  const endpoint = userId ? `/posts?userId=${userId}` : "/posts";
  const queryKey = userId ? ["posts", userId] : ["posts"];
  
  const { isLoading, error, data } = useQuery({
    queryKey,
    queryFn: () =>
      makeRequest.get(endpoint).then((res) => res.data),
  });
  
  return (
    <div className="posts">
      {error
        ? "Erreur lors du chargement"
        : isLoading
        ? "Loading"
        : data?.map((post) => 
          <Post post={post} key={post.id} />
          )}
    </div>
  );
};

export default Posts;
