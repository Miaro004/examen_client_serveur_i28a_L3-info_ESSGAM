import { useState, useContext } from "react";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from "@mui/icons-material/Language";
import { AuthContext } from "../../context/authContext";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    name: "",
    city: "",
    website: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { updateProfile } = useContext(AuthContext);

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log("Erreur lors du téléchargement:", err);
      throw err;
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user) => makeRequest.put("/users", user),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      updateProfile({
        ...variables,
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour:", error);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let coverURL;
      let profileURL;

      coverURL = cover ? await upload(cover) : user.colorPic;
      profileURL = profile ? await upload(profile) : user.profilePic;

      const updatedData = { ...texts, colorPic: coverURL, profilePic: profileURL };
      mutation.mutate(updatedData);
      setOpenUpdate(false);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('update-overlay')) {
      setOpenUpdate(false);
    }
  };

  return (
    <div className="update-overlay" onClick={handleOverlayClick}>
      <div className="update">
        <div className="update-header">
          <h2>Modifier le profil</h2>
          <button 
            className="close-btn" 
            onClick={() => setOpenUpdate(false)}
            aria-label="Fermer"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleClick}>
          <div className="form-group">
            <label htmlFor="cover">
              <PhotoCameraIcon className="label-icon" />
              Photo de couverture
            </label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                id="cover" 
                accept="image/*"
                onChange={(e) => setCover(e.target.files[0])} 
              />
              <span className="file-input-text">
                {cover ? cover.name : "Choisir une image"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="profile">
              <PersonIcon className="label-icon" />
              Photo de profil
            </label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                id="profile" 
                accept="image/*"
                onChange={(e) => setProfile(e.target.files[0])} 
              />
              <span className="file-input-text">
                {profile ? profile.name : "Choisir une image"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">
              <PersonIcon className="label-icon" />
              Nom complet
            </label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder={user.name || "Entrez votre nom"}
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">
              <LocationOnIcon className="label-icon" />
              Ville
            </label>
            <input 
              type="text" 
              id="city" 
              name="city" 
              placeholder={user.city || "Entrez votre ville"}
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">
              <LanguageIcon className="label-icon" />
              Site web
            </label>
            <input 
              type="url" 
              id="website" 
              name="website" 
              placeholder={user.website || "https://votre-site.com"}
              onChange={handleChange} 
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => setOpenUpdate(false)}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
            >
              {isLoading ? "Mise à jour..." : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;