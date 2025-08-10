import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CallIcon from "@mui/icons-material/Call";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { makeRequest } from "../../axios"; 

const Navbar = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirm = window.confirm("Voulez-vous vraiment vous déconnecter ?");
    if (!confirm) return;

    try {
      await axios.post("http://localhost:8800/api/auth/logout");
      localStorage.removeItem("user");
      setCurrentUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Erreur de déconnexion :", err);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim().length === 0) {
        setResults([]);
        return;
      }

      try {
        const res = await makeRequest.get(`/users/search?q=${searchTerm}`);
        setResults(res.data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Erreur recherche utilisateurs :", err);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && results.length > 0) {
      navigate(`/profile/${results[0].id}`);
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>BLouLink+</span>
        </Link>
        <Link to="/" style={{ color: "inherit" }} title="Accueil">
          <HomeOutlinedIcon style={{ cursor: "pointer" }} />
        </Link>
        <CallIcon title="Appels" style={{ cursor: "pointer" }} />
        <GridViewOutlinedIcon title="Applications" style={{ cursor: "pointer" }} />
        <div className="search" ref={searchRef}>
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Rechercher des amis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {showSuggestions && results.length > 0 && (
            <div className="suggestions">
              {results.map((user) => (
                <div
                  key={user.id}
                  className="suggestion-item"
                  onClick={() => {
                    navigate(`/profile/${user.id}`);
                    setSearchTerm("");
                    setShowSuggestions(false);
                  }}
                >
                  <img
                    src={
                      user.profilePic
                        ? `/upload/${user.profilePic}`
                        : "/assets/defaultProfile.jpg"
                    }
                    alt="Photo de profil"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      marginRight: "8px",
                    }}
                  />
                  {user.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="right">
        <Link to={`/profile/${currentUser.id}`} style={{ color: "inherit" }} title="Mon profil">
          <PersonOutlinedIcon style={{ cursor: "pointer" }} />
        </Link>
        <EmailOutlinedIcon title="Messages" style={{ cursor: "pointer" }} />
        <NotificationsOutlinedIcon title="Notifications" style={{ cursor: "pointer" }} />
        <div className="user">
          <Link to={`/profile/${currentUser.id}`} style={{ color: "inherit" }}>
            <img
              src={
                currentUser.profilePic
                  ? `/upload/${currentUser.profilePic}`
                  : "/assets/defaultProfile.jpg"
              }
              alt="Ma photo de profil"
            />
          </Link>
          <span>{currentUser.name}</span>
          <LogoutIcon
            onClick={handleLogout}
            style={{ cursor: "pointer", marginLeft: "10px" }}
            titleAccess="Se déconnecter"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
