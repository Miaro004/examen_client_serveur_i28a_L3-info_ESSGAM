import { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState ({
      username:"",
      password:"",
    });
  
     const [err, setErr] = useState (null);
     const navigate = useNavigate()
  
    const handleChange = e =>{
      setInputs((prev)=>({...prev, [e.target.name]:e.target.value}));
    };
  const { login } = useContext(AuthContext);
  const handleLogin = async(e) => {
    e.preventDefault()
    try {
      await login(inputs);
      navigate("/")
    } catch (err) {
      setErr(err.response.data)
    }
  };

  return (
    <div className="login">
      <div className="container">
        <div className="left-section">
        <div className="brand">
        <div className="brand-container">
          <img src="/assets/logo.jpg" alt="BLouLink Logo" className="logo" />
            <h1>BLouLink+</h1>
          </div>
          <p>BLouLink+ vous permet de rester en contact avec vos proches et de partager votre quotidien avec eux.</p>
        </div>
        </div>
        <div className="right-section">
          <div className="login-card">
            <form>
              <input 
                type="text" 
                placeholder="Nom d'utilisateur" 
                name="username" 
                onChange={handleChange}
              />
              <input 
                type="password" 
                placeholder="Mot de passe" 
                name="password" 
                onChange={handleChange}
              />
              <button type="submit" onClick={handleLogin} className="login-btn">
                Se connecter
              </button>
              {err && <div className="error-message">{err}</div>}
              <div className="divider"></div>
              <Link to="/register">
                <button type="button" className="register-btn">
                  Créer un nouveau compte
                </button>
              </Link>
            </form>
          </div>
          <div className="create-page">
            <p>
              <strong>Créer une page</strong> pour une célébrité, un groupe ou une entreprise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
