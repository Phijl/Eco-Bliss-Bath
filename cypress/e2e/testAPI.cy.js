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
  it("Requête de la liste des produits du panier", () => {
    const randomProduct = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
    cy.getAuthToken().then((token) => {
      cy.request({
        method: "PUT",
        url: `${Cypress.env("apiUrl")}/orders/add`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: {
          product: randomProduct,
          quantity: 1,
        },
      }).then((response) => {
        expect(response.status).to.eq(200); // Vérifie que la réponse est un succès
      });
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/orders`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((response) => {
        expect(response.status).to.eq(200); // Vérifie que la réponse est un succès
        cy.log("Response Body:", JSON.stringify(response.body));
      });
    });
    it("Requête d’une fiche produit spécifique", () => {
      // Requête initiale pour récupérer la liste des produits
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/products`,
      }).then((response) => {
        expect(response.status).to.eq(200); // Vérifie que la requête a réussi
        const products = response.body;
        // Vérifie que la réponse est bien un tableau
        expect(products).to.be.an("array");
        // Boucle sur chaque produit pour tester les détails par ID
        products.forEach((product) => {
          cy.request({
            method: "GET",
            url: `${Cypress.env("apiUrl")}/products/${product.id}`, // Requête pour chaque produit par ID
          }).then((productResponse) => {
            expect(productResponse.status).to.eq(200); // Vérifie que la requête est réussie
            expect(productResponse.body).to.have.property("id", product.id); // Vérifie que l'ID correspond
            expect(productResponse.body).to.have.property("name", product.name); // Vérifie le nom du produit
            expect(productResponse.body).to.have.property(
              "availableStock",
              product.availableStock
            ); // Vérifie le stock
            expect(productResponse.body).to.have.property("skin", product.skin); // Vérifie le type de peau
            expect(productResponse.body).to.have.property(
              "aromas",
              product.aromas
            ); // Vérifie le parfum
            expect(productResponse.body).to.have.property(
              "ingredients",
              product.ingredients
            ); // Vérifie la liste des ingrédients
            expect(productResponse.body).to.have.property(
              "description",
              product.description
            ); // Vérifie la description
            expect(productResponse.body).to.have.property(
              "price",
              product.price
            ); // Vérifie la prix
            expect(productResponse.body).to.have.property(
              "picture",
              product.picture
            ); // Vérifie la presence de l'image
            expect(productResponse.body).to.have.property(
              "varieties",
              product.varieties
            ); // Vérifie la varieties
          });
        });
      });
    });
  });
});
