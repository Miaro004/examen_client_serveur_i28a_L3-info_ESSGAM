import { useContext, useEffect, useRef, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/stories", {
          withCredentials: true,
        });
        setStories(res.data);
        setLoading(false);
      } catch (err) {
        console.log("Error fetching stories:", err);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const handleScroll = () => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      };

      handleScroll(); // Vérifie l'état initial
      scrollRef.current.addEventListener("scroll", handleScroll);
      return () =>
        scrollRef.current?.removeEventListener("scroll", handleScroll);
    }
  }, [stories]);

  const handleAddStory = async (e) => {
    e.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const uploadRes = await axios.post(
            "http://localhost:8800/api/upload",
            formData,
            { withCredentials: true }
          );

          await axios.post(
            "http://localhost:8800/api/stories",
            { image: uploadRes.data },
            { withCredentials: true }
          );

          const res = await axios.get("http://localhost:8800/api/stories", {
            withCredentials: true,
          });
          setStories(res.data);
        } catch (err) {
          console.log("Error adding story:", err);
        }
      }
    };

    input.click();
  };

  const handleDeleteStory = async (storyId) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette story ?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8800/api/stories/${storyId}`, {
        withCredentials: true,
      });

      // Mise à jour des stories après suppression
      const res = await axios.get("http://localhost:8800/api/stories", {
        withCredentials: true,
      });
      setStories(res.data);
    } catch (err) {
      console.log("Erreur lors de la suppression :", err);
    }
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 130;
    const newScrollLeft =
      direction === "left"
        ? Math.max(container.scrollLeft - scrollAmount, 0)
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  if (loading) return <div className="stories">Loading stories...</div>;

  return (
    <div className="stories-wrapper">
      {canScrollLeft && (
        <button className="nav left" onClick={() => scroll("left")}>
          <ArrowBackIosIcon />
        </button>
      )}

      <div className="stories" ref={scrollRef}>
        <div className="story user-story">
          <div className="image-container">
            <img
              src={
                currentUser.profilePic
                  ? `/upload/${currentUser.profilePic}`
                  : "/assets/defaultProfile.jpg"
              }
              alt=""
            />
          </div>
          <span>Ajouter une story</span>
          <button onClick={handleAddStory}>+</button>
        </div>

        {stories.map((story) => (
          <div className="story" key={story.id}>
            <div className="image-container">
              <img src={`./upload/${story.image}`} alt="" />
              {story.userId === currentUser.id && (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteStory(story.id)}
                >
                  ✖
                </button>
              )}
            </div>
            <span>{story.name}</span>
          </div>
        ))}
      </div>

      {canScrollRight && stories.length > 3 && (
        <button className="nav right" onClick={() => scroll("right")}>
          <ArrowForwardIosIcon />
        </button>
      )}
    </div>
  );
};

export default Stories;
