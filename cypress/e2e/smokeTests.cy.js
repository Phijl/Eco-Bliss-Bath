describe("SmokeTests", () => {
  it("Vérifiez la présence des champs et boutons de connexion", () => {
    cy.visit("http://localhost:8080/#/login");
    cy.get('[data-cy="login-input-username"]').should("exist");
    cy.get('[data-cy="login-input-password"]').should("exist");
    cy.get('[data-cy="login-submit"]')
      .should("have.text", "Se connecter")
      .should("exist");
  });
});
