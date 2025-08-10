import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getStories = (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("JWT ERROR:", err);
      return res.status(403).json("Token is not valid");
    }

    // Supprimer automatiquement les stories de plus de 24h
    const deleteOldStoriesQuery = "DELETE FROM stories WHERE createDate < DATE_SUB(NOW(), INTERVAL 24 HOUR)";
    
    db.query(deleteOldStoriesQuery, (err, deleteResult) => {
      if (err) {
        console.log("DELETE OLD STORIES ERROR:", err);
      }

      // Récupérer les stories de l'utilisateur et de ses amis
      const q = `SELECT s.*, u.id AS userId, u.name, u.profilePic 
                 FROM stories AS s 
                 JOIN users AS u ON (u.id = s.userid) 
                 WHERE s.userid = ? 
                 OR s.userid IN (
                   SELECT followeduserid 
                   FROM relationships 
                   WHERE followeruserid = ? AND followeduserid = s.userid
                 )
                 AND s.createDate >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                 ORDER BY s.createDate DESC`;

      const values = [userInfo.id, userInfo.id];

      db.query(q, values, (err, data) => {
        if (err) {
          console.log("DB ERROR:", err);
          return res.status(500).json(err);
        }
        return res.status(200).json(data);
      });
    });
  });
};

export const addStories = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("TOKEN:", token);

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("JWT ERROR:", err);
      return res.status(403).json("Token is not valid");
    }

    const q = "INSERT INTO stories (`image`, `createDate`, `userid`) VALUES (?)";

    const values = [
      req.body.image,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Story has been created");
    });
  });
};

export const deleteStories = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("TOKEN:", token);

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("JWT ERROR:", err);
      return res.status(403).json("Token is not valid");
    }

    const q = "DELETE FROM stories WHERE `id`=? AND `userid`=?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.status(200).json("Story has been deleted");
      return res.status(403).json("You can delete only your story");
    });
  });
};