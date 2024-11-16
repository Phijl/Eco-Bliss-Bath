const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "mochawesome", // Reporter pour les rapports de tests
  env: {
    apiUrl: "http://localhost:8081", // URL de l'API
    username: "test2@test.fr", // Identifiants pour les tests
    password: "testtest",
  },
  e2e: {
    setupNodeEvents(on, config) {
      // Configuration des plugins (si nécessaire)
    },
    baseUrl: "http://localhost:8080/#/", // Base URL pour les tests
    chromeWebSecurity: false, // Désactive certaines restrictions de sécurité pour CORS
  },
  viewportWidth: 1440, // Taille de la fenêtre pour les tests
  viewportHeight: 900,
  browserLaunchOptions: {
    args: [
      "--disable-extensions", // Désactive les extensions
      "--disable-password-manager", // Désactive le gestionnaire de mots de passe
      "--disable-popup-blocking", // Bloque les pop-ups
    ],
  },
  browser: {
    chrome: {
      preferences: {
        credentials_enable_service: false, // Désactive le service de gestion des identifiants
        profile: {
          password_manager_enabled: false, // Désactive le gestionnaire de mots de passe
        },
      },
    },
  },
});
