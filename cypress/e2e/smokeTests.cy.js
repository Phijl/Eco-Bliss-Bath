describe("SmokeTests", () => {
  it("Vérifiez la présence des champs et boutons de connexion", () => {
    cy.visit("/login");
    cy.get('[data-cy="login-input-username"]').should("exist");
    cy.get('[data-cy="login-input-password"]').should("exist");
    cy.get('[data-cy="login-submit"]')
      .should("have.text", "Se connecter")
      .should("exist");
  });
  it(" vériez la présence des boutons d’ajout au panier quand vous êtes connecté ", () => {
    cy.Login();
    cy.get('[data-cy="nav-link-products"]').click();
    cy.wait(2000);
    cy.get('[data-cy="nav-link-products"]').click(); //Attention, si l'on retire cette ligne le test fail. Pour une raison encore inconnu, lorsque l'on clic sur Produits la premiere fois, l'on est rediriger verts http://localhost:8080/products sans le # cela fail donc
    cy.get(':nth-child(1) > .add-to-cart > [data-cy="product-link"]').click();
    cy.get('[data-cy="detail-product-add"]').click();
  });
  it(" vériez la présence du champ de disponibilité du produit.", () => {
    cy.visit("/products");
    cy.get(':nth-child(1) > .add-to-cart > [data-cy="product-link"]').click();
    cy.get('[data-cy="detail-product-stock"]').should("exist");
  });
});
