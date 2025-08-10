import { db } from "../connect.js";
import jwt from "jsonwebtoken";


export const getUser = (req,res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?"

    db.query(q, [userId], (err,data)=>{
        if (err) return res.status(500).json(err)
        
        const {password, ...info} = data[0];
        return res.json(info);
    })
}

export const updateUser = (req,res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not authentified")

    jwt.verify(token, "secretkey", (err, userInfo) =>{
        if (err) return res.status(403).json("Token is not valid")

        const q = "UPDATE users SET `name`=?,`city`=?, `website`=?, `colorPic`=?, `profilePic`=? WHERE id = ?"

        db.query(q,[
            req.body.name,
            req.body.city,
            req.body.website,
            req.body.colorPic,
            req.body.profilePic,
            userInfo.id
        ], (err,data) =>{
            if (err) res.status(500).json(err)
            if (data.affectedRows >0) return res.json("Updated")
            return res.status(403).json("You can update only your post")
        }
    )
    })
}

export const getAllUsers = (req, res) => {
  const q = "SELECT id, name, email, profilePic, colorPic, city, website FROM users";
  
  db.query(q, (err, data) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};

export const getUserById = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT id, name, email, profilePic, colorPic, city, website FROM users WHERE id = ?";
  
  db.query(q, [userId], (err, data) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json(err);
    }
    if (data.length === 0) {
      return res.status(404).json("Utilisateur non trouvé");
    }
    return res.status(200).json(data[0]);
  });
};

export const searchUsers = (req, res) => {
  const search = req.query.q;
  const q = "SELECT id, name, profilePic FROM users WHERE name LIKE ?";
  db.query(q, [`%${search}%`], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
