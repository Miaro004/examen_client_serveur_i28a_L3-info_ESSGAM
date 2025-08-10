import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { makeRequest } from "../../axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Posts from "../../components/posts/Posts";
import { useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const userId = parseInt(location.pathname.split("/")[2]);

  const queryClient = useQueryClient();

  // Récupérer les relations d'amis/demandes
  const { data: sentRequests = [] } = useQuery({
    queryKey: ["sentRequests"],
    queryFn: () =>
      makeRequest
        .get(`/relationships/sent?userid=${currentUser.id}`)
        .then((res) => res.data),
    enabled: !!userId && userId !== "undefined",
  });

  const { data: receivedRequests = [] } = useQuery({
    queryKey: ["receivedRequests"],
    queryFn: () =>
      makeRequest
        .get(`/relationships/received?userid=${currentUser.id}`)
        .then((res) => res.data),
    enabled: !!userId && userId !== "undefined",
  });

  const { data: mutuals = [] } = useQuery({
    queryKey: ["mutuals"],
    queryFn: () =>
      makeRequest
        .get(`/relationships/mutuals?userid=${currentUser.id}`)
        .then((res) => res.data),
    enabled: !!userId && userId !== "undefined",
  });

  // Récupérer les infos utilisateur
  const { isLoading, data, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => res.data),
    enabled: !!userId && userId !== "undefined",
  });

  // Mutations pour gérer les relations
  const sendRequestMutation = useMutation({
    mutationFn: () => makeRequest.post("/relationships/request", { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["receivedRequests"] });
      queryClient.invalidateQueries({ queryKey: ["mutuals"] });
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: () => makeRequest.post("/relationships/accept", { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["receivedRequests"] });
      queryClient.invalidateQueries({ queryKey: ["mutuals"] });
    },
  });

  const removeRequestMutation = useMutation({
    mutationFn: () => makeRequest.delete(`/relationships/request?userId=${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["receivedRequests"] });
      queryClient.invalidateQueries({ queryKey: ["mutuals"] });
    },
  });

  // Déterminer le statut de la relation
  const isMutual = mutuals.includes(userId);
  const isSent = sentRequests.includes(userId);
  const isReceived = receivedRequests.includes(userId);

  // Rafraîchir les données quand on change d'utilisateur
  useEffect(() => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
      queryClient.invalidateQueries({ queryKey: ["receivedRequests"] });
      queryClient.invalidateQueries({ queryKey: ["mutuals"] });
    }
  }, [userId, queryClient]);

  // Rafraîchir quand la page redevient visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
        queryClient.invalidateQueries({ queryKey: ["receivedRequests"] });
        queryClient.invalidateQueries({ queryKey: ["mutuals"] });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [queryClient]);

  if (!userId || userId === "undefined") {
    return <div>Erreur: ID utilisateur non trouvé dans l'URL</div>;
  }

  if (isLoading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur: {error.message}</div>;
  if (!data) return <div>Utilisateur non trouvé</div>;

  // Affichage du bouton selon le statut
  let actionButton = null;
  if (userId === currentUser.id) {
    actionButton = (
      <button onClick={() => setOpenUpdate(true)}>Modifier le profil</button>
    );
  } else if (isMutual) {
    actionButton = (
      <button onClick={() => removeRequestMutation.mutate()}>
        Retirer de mes amis
      </button>
    );
  } else if (isSent) {
    actionButton = (
      <button onClick={() => removeRequestMutation.mutate()}>
        Annuler la demande
      </button>
    );
  } else if (isReceived) {
    actionButton = (
      <>
        <button onClick={() => acceptRequestMutation.mutate()}>
          Accepter
        </button>
        <button onClick={() => removeRequestMutation.mutate()}>
          Refuser
        </button>
      </>
    );
  } else {
    actionButton = (
      <button onClick={() => sendRequestMutation.mutate()}>
        Ajouter
      </button>
    );
  }

  return (
    <div className="profile">
      <div className="images">
        <img
          src={"/upload/" + data.colorPic}
          alt="Photo de couverture"
          className="cover"
          onError={(e) => {
            e.target.src = "/assets/defaultCover.jpeg";
          }}
        />
        <img
          src={"/upload/" + data.profilePic}
          alt="Photo de profil"
          className="profilePic"
          onError={(e) => {
            e.target.src = "/assets/defaultProfile.jpg";
          }}
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>
            {actionButton}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={userId} />
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
