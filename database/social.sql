-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 10 août 2025 à 12:20
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `social`
--

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `desc` varchar(200) NOT NULL,
  `createdate` datetime DEFAULT NULL,
  `userid` int(11) NOT NULL,
  `postid` int(11) NOT NULL,
  `parentid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`id`, `desc`, `createdate`, `userid`, `postid`, `parentid`) VALUES
(13, 'C\'est moche', '2025-08-10 10:26:40', 12, 26, NULL),
(14, 'Toi-même', '2025-08-10 10:27:21', 15, 26, 13),
(15, 'Hehe', '2025-08-10 10:37:03', 12, 26, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `postid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`id`, `userid`, `postid`) VALUES
(41, 15, 26),
(42, 12, 26),
(44, 12, 25),
(45, 12, 21);

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `desc` varchar(200) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  `userid` int(11) NOT NULL,
  `createDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`id`, `desc`, `image`, `userid`, `createDate`) VALUES
(21, 'Mon jeu préféré.', '1754806714451mario.jpg', 12, '2025-08-10 09:18:34'),
(22, 'Envie de faire le tour du monde!!!', '1754807377633voyage.jpg', 13, '2025-08-10 09:29:37'),
(23, 'La plus belle des vues', '1754807517758foret.jpeg', 14, '2025-08-10 09:31:57'),
(25, 'Hala Madrid', '1754808891683RMA.png', 12, '2025-08-10 09:54:51'),
(26, 'Visca Barça', '1754810710335FCB.jpeg', 15, '2025-08-10 10:25:10'),
(27, 'Prix Mp', '1754811579470JBL.jpeg', 15, '2025-08-10 10:39:39');

-- --------------------------------------------------------

--
-- Structure de la table `relationships`
--

CREATE TABLE `relationships` (
  `id` int(11) NOT NULL,
  `followeruserid` int(11) NOT NULL,
  `followeduserid` int(11) NOT NULL,
  `status` enum('pending','accepted') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `relationships`
--

INSERT INTO `relationships` (`id`, `followeruserid`, `followeduserid`, `status`) VALUES
(134, 12, 15, 'accepted'),
(135, 13, 14, 'accepted'),
(136, 13, 15, 'accepted'),
(137, 14, 13, 'accepted'),
(138, 14, 15, 'accepted'),
(139, 15, 12, 'accepted'),
(140, 15, 13, 'accepted'),
(141, 15, 14, 'accepted');

-- --------------------------------------------------------

--
-- Structure de la table `stories`
--

CREATE TABLE `stories` (
  `id` int(11) NOT NULL,
  `image` varchar(200) NOT NULL,
  `createDate` datetime NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `stories`
--

INSERT INTO `stories` (`id`, `image`, `createDate`, `userid`) VALUES
(18, '1754806811693Ajax.png', '2025-08-10 09:20:11', 12),
(19, '1754807573671famille.jpg', '2025-08-10 09:32:53', 14),
(20, '1754810672014Titanic.jpg', '2025-08-10 10:24:32', 15),
(21, '1754811515561misÃ©rables.jpg', '2025-08-10 10:38:35', 12);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(45) NOT NULL,
  `colorPic` varchar(100) DEFAULT NULL,
  `profilePic` varchar(100) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `website` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `name`, `colorPic`, `profilePic`, `city`, `website`) VALUES
(12, 'Mahery', 'andriamahery@gmail.com', '$2b$10$JOBcP9pAuPUkl44UI3yakuTUF8Mz2XvfT2JvEjHQnnNNz52apH4CK', 'Andriaro', NULL, '1754806672107personne_1.png', 'Mahajanga', 'https://instagram/ig_andriaro'),
(13, 'Razafy', 'radorazafy@gmail.com', '$2b$10$OA3s2GLmhdK9AOtUAhgrLeE78MlsAB/IVAxA9YAjM47yXyFaGtXA2', 'Rado', NULL, '1754807198488personne_2.png', 'Antananarivo', 'https://instagram/ig_rado'),
(14, 'Ramanana', 'patricia@gmail.com', '$2b$10$6ngLPvdfvoUl0h8nvnMTk.azgqltoQENT2v/tW0Ut8Up6UxKfCeIG', 'Patricia ', NULL, '1754807487658personne_femme_1.png', 'Toamasina', 'https://instagram/ig_patricia'),
(15, 'Mamonjy', 'mamonjy@gmail.com', '$2b$10$ztOwck4qZoJIj9/F11E/M.Y4kQuX/UysIo8kwYA3AE/orN9K0L0Zq', 'Lydia', NULL, '1754807661282personne_femme_2.png', 'Toliara', 'https://instagram/ig_lydia');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `postid_idx` (`postid`),
  ADD KEY `commentsuserid_idx` (`userid`),
  ADD KEY `idx_comments_parentid` (`parentid`),
  ADD KEY `idx_comments_postid_parentid` (`postid`,`parentid`);

--
-- Index pour la table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `likeuserid_idx` (`userid`),
  ADD KEY `likepostid_idx` (`postid`);

--
-- Index pour la table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- Index pour la table `relationships`
--
ALTER TABLE `relationships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `followeruser_idx` (`followeruserid`),
  ADD KEY `followeduser_idx` (`followeduserid`);

--
-- Index pour la table `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `storieuserid_idx` (`userid`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT pour la table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `relationships`
--
ALTER TABLE `relationships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT pour la table `stories`
--
ALTER TABLE `stories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`parentid`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `commentsuserid` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `postid` FOREIGN KEY (`postid`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likepostid` FOREIGN KEY (`postid`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `likeuserid` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `userid` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `relationships`
--
ALTER TABLE `relationships`
  ADD CONSTRAINT `followeduser` FOREIGN KEY (`followeduserid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `followeruser` FOREIGN KEY (`followeruserid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `stories`
--
ALTER TABLE `stories`
  ADD CONSTRAINT `storieuserid` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
