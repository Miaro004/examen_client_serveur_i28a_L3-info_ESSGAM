Projet Client-Serveur
Installation et Configuration
Prérequis

Git
Node.js et Yarn
XAMPP (pour la base de données MySQL)
Un navigateur web

Étapes d'installation
1. Cloner le projet
Ouvrez Git Bash et exécutez la commande suivante :
bashgit clone https://github.com/Miaro004/examen_client_serveur_i28a_L3-info_ESSGAM.git
2. Configuration de la base de données

Démarrez XAMPP
Accédez à phpMyAdmin
Importez le fichier social.sql situé dans le dossier database du projet

3. Démarrage des services
Terminal 1 - API (Serveur)
Ouvrez un premier terminal Git Bash :
bashcd api
yarn start
Un message "API working" s'affichera pour confirmer que le serveur fonctionne.
Terminal 2 - Client (Interface utilisateur)
Ouvrez un second terminal Git Bash :
bashcd client
yarn start
Le programme démarrera automatiquement dans votre navigateur web par défaut à l'adresse : http://localhost:3000/
Utilisation
Une fois les deux terminaux lancés, l'application sera accessible via votre navigateur à l'adresse http://localhost:3000/.
Dépannage

Assurez-vous que XAMPP est démarré avant de lancer l'API
Vérifiez que les ports 3000 (client) et le port de l'API ne sont pas utilisés par d'autres applications
Si vous rencontrez des erreurs de dépendances, essayez yarn install dans les dossiers api et client