import { db } from "../connect.js";
import jwt  from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {

  const userId = req.query.userId
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("JWT ERROR:", err);
      return res.status(403).json("Token is not valid");
    }

    const q = userId ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p 
              JOIN users AS u ON (u.id = p.userid) WHERE p.userid = ?
              ORDER BY p.createDate DESC` 
              : `SELECT DISTINCT p.*, u.id AS userId, name, profilePic FROM posts AS p 
               JOIN users AS u ON (u.id = p.userid)
               LEFT JOIN relationships AS r ON (p.userid = r.followeduserid) 
               WHERE r.followeruserid = ? OR p.userid = ?
               ORDER BY p.createDate DESC`;

    const values =  userId ? [userId] : [userInfo.id, userInfo.id]

    db.query(q, values, (err, data) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("TOKEN:", token);

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("JWT ERROR:", err);
      return res.status(403).json("Token is not valid");
    }

    const q = "INSERT INTO posts (`desc`,`image`, `createDate`, `userid`) VALUES (?)";

    const values = [
        req.body.desc,
        req.body.image,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id
    ]

    db.query(q, [values], (err, data) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Post has been created");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("TOKEN:", token);

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("JWT ERROR:", err);
      return res.status(403).json("Token is not valid");
    }

    const q = "DELETE FROM posts WHERE `id`=? AND `userid`=?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows>0) return res.status(200).json("Post has been deleted");
      return res.status(403).json("You can delete only your post")
    });
  });
};

