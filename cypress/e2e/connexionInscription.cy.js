describe("ConnexionInscription", () => {
  it("Vérifiez la connexion et la déconnexion", () => {
    cy.Login();
    cy.get('[data-cy="nav-link-logout"]').should("exist");
    // Vérifie la présence du token dans le localStorage
    cy.window().then((window) => {
      const token = window.localStorage.getItem("user");
      expect(token).to.not.be.null; // Vérifie que le token existe
      cy.get('[data-cy="nav-link-logout"]').click();
      cy.window().then((window) => {
        const token = window.localStorage.getItem("user");
        expect(token).be.null; // Vérifie que le token est inexistant
      });
    });
  });
  it("Vérifiez l'inscription", () => {
    cy.visit("/");
    cy.get('[data-cy="nav-link-register"]').should("exist");
    cy.get('[data-cy="nav-link-register"]').click();

    // Générer une adresse e-mail unique
    const uniqueEmail = `testuser_${Date.now()}@example.com`;

    // Remplir les champs du formulaire
    cy.get('[data-cy="register-input-lastname"]').type("Dupont");
    cy.get('[data-cy="register-input-firstname"]').type("Jean");
    cy.get('[data-cy="register-input-email"]').type(uniqueEmail); // Utilise l'adresse unique
    cy.get('[data-cy="register-input-password"]').type("Password123!");
    cy.get('[data-cy="register-input-password-confirm"]').type("Password123!");

    // Surveiller la requête POST
    cy.intercept("POST", "/register").as("registerRequest");

    // Soumettre le formulaire
    cy.get('[data-cy="register-submit"]').click();

    // Vérifier que la requête POST est bien effectuée
    cy.wait("@registerRequest").then((interception) => {
      // Vérifie que la requête a été envoyée avec succès
      expect(interception.response.statusCode).to.eq(200);

      // Vérifiez les données envoyées dans le body
      expect(interception.request.body).to.have.property("email", uniqueEmail);
      cy.get('[data-cy="nav-link-logout"]').click();
      cy.get('[data-cy="nav-link-login"]').click();
      cy.get('[data-cy="login-input-username"]').type(uniqueEmail);
      cy.get('[data-cy="login-input-password"]').type("Password123!");
      cy.get('[data-cy="login-submit"]').click();
      cy.wait(1000);
      cy.window().then((window) => {
        const token = window.localStorage.getItem("user");
        expect(token).to.not.be.null; // Vérifie que le token existe
      });
    });
  });
});
