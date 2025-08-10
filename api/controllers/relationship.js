import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelations = (req, res) =>{
    
        const q = "SELECT followeruserid FROM relationships WHERE followeduserid = ?";
    
        db.query(q, [req.query.followeduserid], (err, data) => {
          if (err) {
            console.log("DB ERROR:", err);
            return res.status(500).json(err);
          }
          return res.status(200).json(data.map(relationship=>relationship.followeruserid));
        });
}

export const addRelations = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("TOKEN:", token);

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("JWT ERROR:", err);
      return res.status(403).json("Token is not valid");
    }

    const q = "INSERT INTO relationships (`followeruserid`, `followeduserid`) VALUES (?)";

    const values = [
        userInfo.id,
        req.body.userId
    ]

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following");
    });
  });
};

export const deleteRelations = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("TOKEN:", token);

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("JWT ERROR:", err);
      return res.status(403).json("Token is not valid");
    }

    const q = "DELETE FROM relationships WHERE `followeruserid` = ? AND `followeduserid` = ?";


    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow");
    });
  });
};

export const getFollowers = (req, res) => {
  const q = "SELECT followeduserid FROM relationships WHERE followeruserid = ?";
  
  db.query(q, [req.query.userid], (err, data) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data.map(relationship => relationship.followeduserid));
  });
};

// Envoyer une demande d'ami (statut 'pending')
export const sendRequest = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Non authentifié !");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token invalide !");
    const q = "INSERT INTO relationships (`followeruserid`, `followeduserid`, `status`) VALUES (?, ?, 'pending')";
    db.query(q, [userInfo.id, req.body.userId], (err) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Demande envoyée !");
    });
  });
};

// Accepter une demande d'ami (statut 'accepted')
export const acceptRequest = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Non authentifié !");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token invalide !");
    // Met à jour la demande en 'accepted'
    const q = "UPDATE relationships SET status='accepted' WHERE followeruserid=? AND followeduserid=? AND status='pending'";
    db.query(q, [req.body.userId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      // Crée la relation réciproque
      const q2 = "INSERT INTO relationships (`followeruserid`, `followeduserid`, `status`) VALUES (?, ?, 'accepted')";
      db.query(q2, [userInfo.id, req.body.userId], (err2) => {
        if (err2) return res.status(500).json(err2);
        return res.status(200).json("Demande acceptée, vous êtes maintenant amis !");
      });
    });
  });
};

// Annuler/refuser une demande d'ami (supprimer la relation 'pending')
export const removeRequest = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Non authentifié !");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token invalide !");
    // Peut annuler une demande envoyée ou reçue
    const q = `
      DELETE FROM relationships 
      WHERE 
        ((followeruserid=? AND followeduserid=? AND status='pending') 
        OR (followeruserid=? AND followeduserid=? AND status='pending'))
    `;
    db.query(q, [userInfo.id, req.query.userId, req.query.userId, userInfo.id], (err) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Demande annulée/refusée !");
    });
  });
};

// Obtenir les demandes envoyées (pending)
export const getSentRequests = (req, res) => {
  const userId = req.query.userid;
  const q = "SELECT followeduserid FROM relationships WHERE followeruserid=? AND status='pending'";
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map(row => row.followeduserid));
  });
};

// Obtenir les demandes reçues (pending)
export const getReceivedRequests = (req, res) => {
  const userId = req.query.userid;
  const q = "SELECT followeruserid FROM relationships WHERE followeduserid=? AND status='pending'";
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map(row => row.followeruserid));
  });
};

// Obtenir les amis mutuels (accepted)
export const getMutuals = (req, res) => {
  const userId = req.query.userid;
  // On récupère les utilisateurs qui ont une relation accepted dans les deux sens
  const q = `
    SELECT r1.followeduserid FROM relationships r1
    JOIN relationships r2 ON r1.followeduserid = r2.followeruserid
    WHERE r1.followeruserid = ? AND r1.status='accepted'
      AND r2.followeduserid = ? AND r2.status='accepted'
  `;
  db.query(q, [userId, userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map(row => row.followeduserid));
  });
};