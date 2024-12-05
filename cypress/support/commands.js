Cypress.Commands.add("Login", () => {
  cy.visit("/login");
  cy.get('[data-cy="login-input-username"]').type(Cypress.env("username"));
  cy.get('[data-cy="login-input-password"]').type(Cypress.env("password"));
  cy.get('[data-cy="login-submit"]').click();
});

Cypress.Commands.add("getAuthToken", () => {
  const username = Cypress.env("username");
  const password = Cypress.env("password");

  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/login`,
    body: {
      username: username,
      password: password,
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    expect(response.status).to.eq(200); // Vérifie que la requête est réussie
    return response.body.token; // Retourne le token de la réponse
  });
});

Cypress.Commands.add("getAuthToken2", () => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("apiUrl")}/login`,
    body: {
      username: "testuser_1733419609524@example.com",
      password: "Password123!",
    },
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    expect(response.status).to.eq(200); // Vérifie que la requête est réussie
    return response.body.token; // Retourne le token de la réponse
  });
});
