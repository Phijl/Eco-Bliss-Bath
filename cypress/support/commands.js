Cypress.Commands.add("Login", () => {
  cy.visit("/login");
  cy.get('[data-cy="login-input-username"]').type(Cypress.env("username"));
  cy.get('[data-cy="login-input-password"]').type(Cypress.env("password"));
  cy.get('[data-cy="login-submit"]').click();
});
