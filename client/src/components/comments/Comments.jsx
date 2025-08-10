import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postid }) => {
  const [desc, setDesc] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const { currentUser } = useContext(AuthContext);
  
  const { isLoading, data } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
      makeRequest.get("/comments?postid=" + postid).then((res) => res.data),
  });

  const queryClient = useQueryClient();

  // Mutation pour ajouter un commentaire
  const addMutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  // Mutation pour supprimer un commentaire
  const deleteMutation = useMutation({
    mutationFn: (commentId) => makeRequest.delete(`/comments/${commentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!desc.trim()) return;
    
    addMutation.mutate({ desc, postid });
    setDesc("");
  };

  const handleReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    addMutation.mutate({ 
      desc: replyText, 
      postid, 
      parentid: parentId 
    });
    setReplyText("");
    setReplyingTo(null);
  };

  const handleDeleteComment = (commentId, isParent, repliesCount = 0) => {
    let confirmMessage;
    
    if (isParent && repliesCount > 0) {
      confirmMessage = `Êtes-vous sûr de vouloir supprimer ce commentaire et ses ${repliesCount} réponse(s) ?`;
    } else if (isParent) {
      confirmMessage = "Êtes-vous sûr de vouloir supprimer ce commentaire ?";
    } else {
      confirmMessage = "Êtes-vous sûr de vouloir supprimer cette réponse ?";
    }
    
    if (window.confirm(confirmMessage)) {
      deleteMutation.mutate(commentId);
    }
  };

  const handleKeyPress = (e, action, parentId = null) => {
    if (e.key === 'Enter') {
      if (action === 'reply') {
        handleReply(e, parentId);
      } else {
        handleAddComment(e);
      }
    }
  };

  const renderComment = (comment, isReply = false) => (
    <div key={comment.id} className={`comment ${isReply ? 'reply' : ''}`}>
      <img 
        src={
          comment.profilePic
            ? `/upload/${comment.profilePic}`
            : "/assets/defaultProfile.jpg"
        } 
        alt="Photo de profil" 
      />
      <div className="info">
        <div className="comment-header">
          <span className="username">{comment.name}</span>
          {comment.parentid && comment.parentUserName && (
            <span className="reply-to">
              en réponse à <strong>{comment.parentUserName}</strong>
            </span>
          )}
          <span className="date">
            {moment(comment.createdate).fromNow()}
          </span>
        </div>
        <p className="comment-text">{comment.desc}</p>
        
        <div className="comment-actions">
          {!isReply && (
            <button 
              className="reply-btn"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            >
              {replyingTo === comment.id ? "Annuler" : "Répondre"}
            </button>
          )}
          
          {comment.userid === currentUser.id && (
            <button 
              className={`delete-btn ${!isReply && comment.replies?.length > 0 ? 'delete-all' : ''}`}
              onClick={() => handleDeleteComment(
                comment.id, 
                !isReply, 
                !isReply ? comment.replies?.length || 0 : 0
              )}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? "Suppression..." : 
               (!isReply && comment.replies?.length > 0 ? "Supprimer tout" : "Supprimer")}
            </button>
          )}
        </div>

        {replyingTo === comment.id && (
          <div className="reply-form">
            <img 
              src={
                currentUser.profilePic
                  ? `/upload/${currentUser.profilePic}`
                  : "/assets/defaultProfile.jpg"
              } 
              alt="Photo de profil" 
            />
            <input 
              type="text" 
              placeholder={`Répondre à ${comment.name}...`}
              value={replyText} 
              onChange={e => setReplyText(e.target.value)}
              onKeyPress={e => handleKeyPress(e, 'reply', comment.id)}
              autoFocus
            />
            <button 
              onClick={e => handleReply(e, comment.id)}
              disabled={addMutation.isLoading || !replyText.trim()}
            >
              {addMutation.isLoading ? "Envoi..." : "Répondre"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="comments">
      <div className="write">
        <img 
          src={
            currentUser.profilePic
              ? `/upload/${currentUser.profilePic}`
              : "/assets/defaultProfile.jpg"
          } 
          alt="Photo de profil" 
        />
        <input 
          type="text" 
          placeholder="Écrivez un commentaire..." 
          value={desc} 
          onChange={e => setDesc(e.target.value)}
          onKeyPress={e => handleKeyPress(e, 'comment')}
        />
        <button 
          onClick={handleAddComment}
          disabled={addMutation.isLoading || !desc.trim()}
        >
          {addMutation.isLoading ? "Publication..." : "Publier"}
        </button>
      </div>
      
      {isLoading ? (
        <div className="loading">Chargement des commentaires...</div>
      ) : data && data.length > 0 ? (
        <div className="comments-container">
          {data.map((comment) => (
            <div key={comment.id} className="comment-thread">
              {renderComment(comment)}
              
              {comment.replies && comment.replies.length > 0 && (
                <div className="replies-container">
                  {comment.replies.map((reply) => renderComment(reply, true))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-comments">
          Aucun commentaire pour le moment. Soyez le premier à commenter !
        </div>
      )}
    </div>
  );
};

export default Comments;
