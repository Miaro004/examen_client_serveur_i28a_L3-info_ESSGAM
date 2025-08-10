import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import "./rightBar.scss";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Tous les utilisateurs sauf moi
  const { data: allUsers = [] } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () =>
      makeRequest.get("/users/all").then(res =>
        res.data.filter(user => user.id !== currentUser.id)
      ),
  });

  // Amis mutuels (accepted)
  const { data: mutuals = [] } = useQuery({
    queryKey: ["mutuals"],
    queryFn: () =>
      makeRequest.get(`/relationships/mutuals?userid=${currentUser.id}`).then(res => res.data),
  });

  // Demandes envoyées par moi (pending, où je suis demandeur)
  const { data: sentRequests = [] } = useQuery({
    queryKey: ["sentRequests"],
    queryFn: () =>
      makeRequest.get(`/relationships/sent?userid=${currentUser.id}`).then(res => res.data),
  });

  // Demandes reçues par moi (pending, où je suis receveur)
  const { data: receivedRequests = [] } = useQuery({
    queryKey: ["receivedRequests"],
    queryFn: () =>
      makeRequest.get(`/relationships/received?userid=${currentUser.id}`).then(res => res.data),
  });

  // Suggestions = ni ami, ni demande envoyée, ni demande reçue
  const suggestions = allUsers.filter(
    user =>
      !mutuals.includes(user.id) &&
      !sentRequests.includes(user.id) &&
      !receivedRequests.includes(user.id)
  );

  // Mutation pour envoyer une demande de suivi
  const sendRequestMutation = useMutation({
    mutationFn: (userId) => makeRequest.post("/relationships/request", { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["receivedRequests"] });
      queryClient.invalidateQueries({ queryKey: ["mutuals"] });
    },
  });

  // Mutation pour accepter une demande reçue
  const acceptRequestMutation = useMutation({
    mutationFn: (userId) => makeRequest.post("/relationships/accept", { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["receivedRequests"] });
      queryClient.invalidateQueries({ queryKey: ["mutuals"] });
    },
  });

  // Mutation pour retirer/refuser une demande (envoyée ou reçue)
  const removeRequestMutation = useMutation({
    mutationFn: (userId) => makeRequest.delete(`/relationships/request?userId=${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["receivedRequests"] });
      queryClient.invalidateQueries({ queryKey: ["mutuals"] });
    },
  });

  return (
    <div className="rightBar">
      <div className="container">

        {/* Suggestions d'amis */}
        {suggestions.length > 0 && (
          <div className="item">
            <div className="section-header">
              <span>Suggestions d'amis</span>
            </div>
            {suggestions.slice(0, 5).map(user => (
              <div key={user.id} className="user">
                <div className="userInfo">
                  <img src={user.profilePic ? `/upload/${user.profilePic}` : "/assets/defaultProfile.jpg"} alt={user.name} />
                  <span className="username">{user.name}</span>
                </div>
                <button
                  className="follow-btn"
                  onClick={() => sendRequestMutation.mutate(user.id)}
                  disabled={sendRequestMutation.isLoading}
                >
                  Envoyer une demande
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Demandes reçues (à accepter ou refuser) */}
        {receivedRequests.length > 0 && (
          <div className="item">
            <div className="section-header">
              <span>Demandes d'amis reçues</span>
            </div>
            {allUsers
              .filter(user => receivedRequests.includes(user.id))
              .map(user => (
                <div key={user.id} className="user">
                  <div className="userInfo">
                    <img src={user.profilePic ? `/upload/${user.profilePic}` : "/assets/defaultProfile.jpg"} alt={user.name} />
                    <span className="username">{user.name}</span>
                  </div>
                  <button
                    className="follow-btn"
                    onClick={() => acceptRequestMutation.mutate(user.id)}
                    disabled={acceptRequestMutation.isLoading}
                  >
                    Accepter
                  </button>
                  <button
                    className="follow-btn"
                    style={{ background: "#888", marginLeft: 8 }}
                    onClick={() => removeRequestMutation.mutate(user.id)}
                    disabled={removeRequestMutation.isLoading}
                  >
                    Refuser
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Demandes envoyées (en attente) */}
        {sentRequests.length > 0 && (
          <div className="item">
            <div className="section-header">
              <span>Demandes envoyées</span>
            </div>
            {allUsers
              .filter(user => sentRequests.includes(user.id))
              .map(user => (
                <div key={user.id} className="user">
                  <div className="userInfo">
                    <img src={user.profilePic ? `/upload/${user.profilePic}` : "/assets/defaultProfile.jpg"} alt={user.name} />
                    <span className="username">{user.name}</span>
                  </div>
                  <button
                    className="follow-btn"
                    style={{ background: "#888" }}
                    onClick={() => removeRequestMutation.mutate(user.id)}
                    disabled={removeRequestMutation.isLoading}
                  >
                    Annuler
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Amis mutuels */}
        <div className="item">
          <div className="section-header">
            <span>Amis mutuels ({mutuals.length})</span>
          </div>
          {allUsers
            .filter(user => mutuals.includes(user.id))
            .map(friend => (
              <div key={friend.id} className="user online-friend">
                <div className="userInfo">
                  <img src={friend.profilePic ? `/upload/${friend.profilePic}` : "/assets/defaultProfile.jpg"} alt={friend.name} />
                  <span className="username">{friend.name}</span>
                  <span className="mutual-badge">Ami mutuel</span>
                </div>
              </div>
            ))}
          {mutuals.length === 0 && (
            <div className="empty-state">
              <p>Aucun ami mutuel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
