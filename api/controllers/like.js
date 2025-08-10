import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
    const q = "SELECT userid FROM likes WHERE postid=?";
    
    db.query(q, [req.query.postid], (err, data) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json(err);
      }
      
      return res.status(200).json(data.map(like => like.userid));
    });
}

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("TOKEN:", token);

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("JWT ERROR:", err);
      return res.status(403).json("Token is not valid");
    }

    const q = "INSERT INTO likes (`userid`, `postid`) VALUES (?, ?)";

    
    db.query(q, [userInfo.id, req.body.postid], (err, data) => {
      if (err) {
        console.log("INSERT ERROR:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Post has been liked");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  console.log("TOKEN:", token);

  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.log("JWT ERROR:", err);
      return res.status(403).json("Token is not valid");
    }

    const q = "DELETE FROM likes WHERE `userid` = ? AND `postid` = ?";

    db.query(q, [userInfo.id, req.query.postid], (err, data) => {
      if (err) {
        console.log("DELETE ERROR:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Post has been disliked");
    });
  });
};