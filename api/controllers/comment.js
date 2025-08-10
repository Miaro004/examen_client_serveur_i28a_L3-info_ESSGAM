import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS userid, u.name, u.profilePic, 
             parent.id AS parentId, parent_user.name AS parentUserName
             FROM comments AS c
             JOIN users AS u ON (u.id = c.userid)
             LEFT JOIN comments AS parent ON (c.parentid = parent.id)
             LEFT JOIN users AS parent_user ON (parent.userid = parent_user.id)
             WHERE c.postid = ?
             ORDER BY 
               CASE WHEN c.parentid IS NULL THEN c.id ELSE c.parentid END ASC,
               c.parentid ASC,
               c.createdate ASC`;

  db.query(q, [req.query.postid], (err, data) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json(err);
    }
    
    // Organiser les commentaires en structure hiérarchique
    const comments = [];
    const commentMap = {};
    
    data.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
      
      if (comment.parentid === null) {
        // Commentaire principal
        comments.push(comment);
      } else {
        // Réponse à un commentaire
        const parentComment = commentMap[comment.parentid];
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      }
    });
    
    return res.status(200).json(comments);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("TOKEN:", token);

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("JWT ERROR:", err);
      return res.status(403).json("Token is not valid");
    }

    const q = "INSERT INTO comments (`desc`, `createdate`, `userid`, `postid`, `parentid`) VALUES (?)";

    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postid,
      req.body.parentid || null // null pour commentaire principal, id pour réponse
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Comment has been created");
    });
  });
};

export const deleteComment = (req, res) => {
  const token = req.cookies.accessToken;
  
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("JWT ERROR:", err);
      return res.status(403).json("Token is not valid");
    }

    const commentId = req.params.id;
    
    // Vérifier si l'utilisateur est le propriétaire du commentaire
    const checkOwnershipQ = "SELECT userid, parentid FROM comments WHERE id = ?";
    
    db.query(checkOwnershipQ, [commentId], (err, data) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json(err);
      }
      
      if (data.length === 0) {
        return res.status(404).json("Comment not found");
      }
      
      if (data[0].userid !== userInfo.id) {
        return res.status(403).json("You can only delete your own comments");
      }
      
      const isParentComment = data[0].parentid === null;
      
      if (isParentComment) {
        // Si c'est un commentaire mère, supprimer d'abord toutes ses réponses
        const deleteRepliesQ = "DELETE FROM comments WHERE parentid = ?";
        
        db.query(deleteRepliesQ, [commentId], (err) => {
          if (err) {
            console.log("DB ERROR:", err);
            return res.status(500).json(err);
          }
          
          // Ensuite supprimer le commentaire mère
          const deleteMainCommentQ = "DELETE FROM comments WHERE id = ?";
          
          db.query(deleteMainCommentQ, [commentId], (err) => {
            if (err) {
              console.log("DB ERROR:", err);
              return res.status(500).json(err);
            }
            return res.status(200).json("Comment and all replies have been deleted");
          });
        });
      } else {
        // Si c'est une réponse, supprimer seulement ce commentaire
        const deleteReplyQ = "DELETE FROM comments WHERE id = ?";
        
        db.query(deleteReplyQ, [commentId], (err) => {
          if (err) {
            console.log("DB ERROR:", err);
            return res.status(500).json(err);
          }
          return res.status(200).json("Reply has been deleted");
        });
      }
    });
  });
};
