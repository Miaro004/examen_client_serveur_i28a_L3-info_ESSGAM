import express  from "express";
import { getUser, updateUser, getAllUsers, getUserById, searchUsers} from "../controllers/user.js";

const router = express.Router()

router.get("/find/:userId" , getUser)
router.put("/" , updateUser)
router.get("/all", getAllUsers);
router.get("/find/:userId", getUserById);
router.get("/search", searchUsers);

export default router 