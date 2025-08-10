import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment";
import { makeRequest } from "../../axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);
  
  const { isLoading, data } = useQuery({
    queryKey: ["likes", post?.id],
    queryFn: () =>
      makeRequest.get("/likes?postid=" + post.id).then((res) => {
        return res.data;
      }),
  });

  const { data: commentsData } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () =>
      makeRequest.get("/comments?postid=" + post.id).then((res) => res.data),
  });
  
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) {
        return makeRequest.delete("/likes?postid=" + post.id);
      } else {
        return makeRequest.post("/likes", { postid: post.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", post.id] });
    },
    onError: (error) => {
      console.error("Mutation error details:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (postid) => {
      return makeRequest.delete("/posts/" + postid);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Mutation error details:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
    },
  });

  const handleLike = () => {
    if (data && currentUser) {
      const isLiked = data.includes(currentUser.id);  
      mutation.mutate(isLiked);
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id)
  }

  const userIdForProfile = post?.userId || post?.user_id || post?.authorId;
  
  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={
              post.profilePic
              ? `/upload/${post.profilePic}`
              : "/assets/defaultProfile.jpg"
              } alt="" />
            <div className="details">
              {userIdForProfile ? (
                <Link
                  to={`/profile/${userIdForProfile}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="name">{post.name}</span>
                </Link>
              ) : (
                <span className="name">{post.name}</span>
              )}
              <span className="date">{moment(post.createDate).fromNow()}</span>
            </div>
          </div>
          <div className="menu-container">
            <MoreHorizIcon className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />
            {menuOpen && post.userId === currentUser.id && (
              <button onClick={handleDelete} className="delete-btn">
                Supprimer
              </button>
            )}
          </div>
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {post.image && <img src={"/upload/" + post.image} alt="" />}
        </div>
        <div className="info">
          <div className="item like-item">
            {isLoading ? (
              <span className="loading">Chargement...</span>
            ) : data?.includes(currentUser?.id) ? (
              <FavoriteOutlinedIcon className="liked-icon" onClick={handleLike} />
            ) : (
              <FavoriteBorderOutlinedIcon className="like-icon" onClick={handleLike} />
            )}
            <span className="count">{data?.length ?? 0}</span>
            <span className="label">J'adore</span>
          </div>
          <div className="item comment-item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
                       <span>
              Commenter
              {commentsData && (
                <span className="comment-count"> ({commentsData.length})</span>
              )}
            </span>
          </div>
          <div className="item share-item">
            <ShareOutlinedIcon />
            <span>Partager</span>
          </div>
        </div>
        {commentOpen && <Comments postid={post.id} />}
      </div>
    </div>
  );
};

export default Post;
