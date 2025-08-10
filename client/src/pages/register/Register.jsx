import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState ({
    username:"",
    email:"",
    password:"",
    name:"",
  });
   const [err, setErr] = useState (null);
   const [success, setSuccess] = useState (false);
   const navigate = useNavigate();
   
  const handleChange = e =>{
    setInputs(prev=>({...prev, [e.target.name]:e.target.value}));
  };
  const handleClick = async e =>{
    e.preventDefault()
    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      setSuccess(true);
      setErr(null);
      // Redirection vers la page de login après 2 secondes
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setErr(err.response.data);
      setSuccess(false);
    }
  };
  console.log(err)
  return (
    <div className="register">
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
          <div className="register-card">
            <div className="header">
              <h1>Créer un nouveau compte</h1>
              <p>C'est rapide et facile.</p>
            </div>
            <form>
              <div className="name-row">
                <input 
                  type="text" 
                  placeholder="Prénom" 
                  name="name" 
                  onChange={handleChange}
                />
                <input 
                  type="text" 
                  placeholder="Nom d'utilisateur" 
                  name="username" 
                  onChange={handleChange}
                />
              </div>
              <input 
                type="email" 
                placeholder="Adresse e-mail" 
                name="email" 
                onChange={handleChange}
              />
              <input 
                type="password" 
                placeholder="Mot de passe" 
                name="password" 
                onChange={handleChange}
              />
              {err && <div className="error-message">{err}</div>}
              {success && <div className="success-message">Compte créé avec succès !</div>}
              
              <div className="birthday-section">
                <label>Date de naissance</label>
                <div className="birthday-inputs">
                  <select>
                    <option>Jour</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <select>
                    <option>Mois</option>
                    <option value="1">Janvier</option>
                    <option value="2">Février</option>
                    <option value="3">Mars</option>
                    <option value="4">Avril</option>
                    <option value="5">Mai</option>
                    <option value="6">Juin</option>
                    <option value="7">Juillet</option>
                    <option value="8">Août</option>
                    <option value="9">Septembre</option>
                    <option value="10">Octobre</option>
                    <option value="11">Novembre</option>
                    <option value="12">Décembre</option>
                  </select>
                  <select>
                    <option>Année</option>
                    {[...Array(100)].map((_, i) => (
                      <option key={2024 - i} value={2024 - i}>{2024 - i}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="gender-section">
                <label>Genre</label>
                <div className="gender-options">
                  <label className="gender-option">
                    <span>Femme</span>
                    <input type="radio" name="gender" value="female" />
                  </label>
                  <label className="gender-option">
                    <span>Homme</span>
                    <input type="radio" name="gender" value="male" />
                  </label>
                  <label className="gender-option">
                    <span>Personnalisé</span>
                    <input type="radio" name="gender" value="custom" />
                  </label>
                </div>
              </div>

              <div className="terms">
                <p>
                  En cliquant sur "S'inscrire", vous acceptez nos{" "}
                  <button type="button" className="link-button">Conditions générales</button>, notre{" "}
                  <button type="button" className="link-button">Politique de confidentialité</button> et notre{" "}
                  <button type="button" className="link-button">Politique d'utilisation des cookies</button>.
                </p>
              </div>

              <button type="submit" onClick={handleClick} className="register-btn">
                S'inscrire
              </button>
            </form>
            
            <div className="login-link">
              <Link to="/login">Vous avez déjà un compte ?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
