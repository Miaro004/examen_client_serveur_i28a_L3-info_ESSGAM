import express from "express";
import {
  getRelations,
  addRelations,
  deleteRelations,
  getFollowers,
  getSentRequests,
  getReceivedRequests,
  sendRequest,
  acceptRequest,
  removeRequest,
  getMutuals
} from "../controllers/relationship.js";

const router = express.Router();

// Anciennes routes
router.get("/", getRelations);
router.post("/", addRelations);
router.delete("/", deleteRelations);
router.get("/followers", getFollowers);

// Nouvelles routes pour gestion des demandes d'amis
router.get("/sent", getSentRequests); // demandes envoyées (pending)
router.get("/received", getReceivedRequests); // demandes reçues (pending)
router.post("/request", sendRequest); // envoyer une demande
router.post("/accept", acceptRequest); // accepter une demande
router.delete("/request", removeRequest); // annuler/refuser une demande
router.get("/mutuals", getMutuals); // amis mutuels (accepted)

export default router;