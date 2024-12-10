# Eco-Bliss

## Description

Eco-Bliss est un site boutique conçue pour une start-up, Eco Bliss Bath, de 20 personnes, spécialisée dans la vente de produits de beauté écoresponsables dont le produit principal est un savon solide.
Ce projet inclut une configuration Docker pour un déploiement rapide ainsi qu'un système de tests automatisés avec Cypress.

## Prérequis

Assurez-vous d'avoir installé les outils suivants sur votre machine avant de commencer :

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (pour les tests Cypress)
- Un navigateur pris en charge (comme Chrome) pour les tests E2E.

## Lancer l'application avec Docker

1. Clonez le dépôt :

   git clone https://github.com/Phijl/Eco-Bliss-Bath.git
   cd Eco-Bliss-Bath

2. Construisez et démarrez les conteneurs Docker :

   docker-compose up --build

3. Accédez à l'application :
   - **Site web** : [http://localhost:8080/#/]
   - **Swagger API Documentation** : [http://localhost:8081/api/doc]

## Lancer les tests Cypress

1. Installez les dépendances si ce n'est pas encore fait :

   npm install

2. Ouvrez Cypress en mode interactif :

   npx cypress open

3. Sélectionnez :

   - **E2E testing** dans le menu Cypress.
   - Le navigateur souhaité (par exemple, Chrome).

4. Lancez les tests en cliquant sur un fichier de test dans l'interface.

## Structure du projet

- **Frontend** : Code de l'interface utilisateur
- **Backend** : Logique métier et API REST
- **Tests** : Le dossier `cypress` contient les tests automatisés pour les fonctionnalités clés.
