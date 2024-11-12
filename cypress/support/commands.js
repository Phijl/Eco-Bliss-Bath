Cypress.Commands.add("Connect", () => {
  const username = Cypress.env("username");
  const password = Cypress.env("password");
  cy.visit("/login");
  cy.getBySel("login-input-username").type(username);
  cy.getBySel("login-input-password").type(password);
  cy.getBySel("login-submit").click();
});
