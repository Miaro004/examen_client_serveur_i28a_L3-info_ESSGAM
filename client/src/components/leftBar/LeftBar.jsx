import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <Link to={`/profile/${currentUser.id}`} style={{ color: "inherit" }}>
          <div className="user">
            <img
              src={
              currentUser.profilePic
              ? `/upload/${currentUser.profilePic}`
              : "/assets/defaultProfile.jpg"
              }
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>
          </Link>
          <div className="item">
            <img src={Friends} alt="" />
            <span>Amis</span>
          </div>
          <div className="item">
            <img src={Groups} alt="" />
            <span>Groupes</span>
          </div>
          <div className="item">
            <img src={Market} alt="" />
            <span>Marketplace</span>
          </div>
          <div className="item">
            <img src={Watch} alt="" />
            <span>Vidéos</span>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <span>Souvenirs</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Vos raccourcis</span>
          <div className="item">
            <img src={Events} alt="" />
            <span>Événements</span>
          </div>
          <div className="item">
            <img src={Gaming} alt="" />
            <span>Jeux</span>
          </div>
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Galerie</span>
          </div>
          <div className="item">
            <img src={Videos} alt="" />
            <span>Vidéos</span>
          </div>
          <div className="item">
            <img src={Messages} alt="" />
            <span>Messages</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <span>Autres</span>
          <div className="item">
            <img src={Fund} alt="" />
            <span>Collecte de fonds</span>
          </div>
          <div className="item">
            <img src={Tutorials} alt="" />
            <span>Tutoriels</span>
          </div>
          <div className="item">
            <img src={Courses} alt="" />
            <span>Cours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
