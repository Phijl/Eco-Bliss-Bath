describe("API", () => {
  it("Requête sur les données condentielles d'un utilisateur avant connexion pour vérier que je reçois une erreur 401", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/orders`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});
