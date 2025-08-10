import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = () => {
  const [file, setFile] = useState(null)
  const [desc, setDesc] = useState("")

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file)
      const res = await makeRequest.post("/upload", formData)
      return res.data

    } catch (err) {
      console.log(err)
    }
  }

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newPost) => makeRequest.post("/posts", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleClick = async e => {
    e.preventDefault()
    console.log("Partage demandé !");
    let imageurl = ""
    if (file) imageurl = await upload()
    mutation.mutate({ desc, image: imageurl })
    setDesc("")
    setFile(null)
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={
              currentUser.profilePic
                ? `/upload/${currentUser.profilePic}`
                : "/assets/defaultProfile.jpg"
            } alt="" />
            <input 
              type="text" 
              placeholder={`Quoi de neuf ${currentUser.name} ?`} 
              onChange={e => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && <img className="file" alt="" src={URL.createObjectURL(file)} />}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Ajouter une image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Ajouter un lieu</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Identifier des amis</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Partager</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
