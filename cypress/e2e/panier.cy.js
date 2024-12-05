describe("Panier", () => {
  it("Vérifiez le stock", () => {
    cy.getAuthToken().then((token) => {
      cy.request({
        method: "GET",
        url: `${Cypress.env("apiUrl")}/products`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        // response.body contient les données directement
        const outOfStockProducts = response.body.filter(
          (product) => product.availableStock <= 0
        );
        cy.log(
          "Produits en rupture de stock : " + JSON.stringify(outOfStockProducts)
        );
        // Tester l'ajout de chaque produit au panier
        outOfStockProducts.forEach((product) => {
          cy.log(`Test d'ajout au panier du produit : ${product.name}`);

          // Aller sur la page produit
          cy.visit(`/products/${product.id}`);

          // Vérifier que le bouton "Ajouter au panier" est désactivé
          cy.get('[data-cy="detail-product-add"]')
            .should("be.disabled")
            .then(() => {
              cy.log(
                `Le produit ${product.name} ne peut pas être ajouté au panier.`
              );
            });
        });
      });
    });
  });
  it("Vérifiez ajout au panier avec mise à jour du stock", () => {
    cy.Login(); // Appelle la commande personnalisée

    // Effectue la requête après le login
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/products`, // Vérifie que cette URL est correcte
    }).then((response) => {
      // Filtrer le premier produit en stock
      const firstOnStockProduct = response.body.find(
        (product) => product.availableStock > 0
      );

      if (!firstOnStockProduct) {
        cy.log("Aucun produit en stock disponible pour le test.");
        return;
      }

      const product = firstOnStockProduct;
      const initialStock = product.availableStock;

      cy.log(`Test d'ajout au panier pour le produit : ${product.name}`);

      // Aller sur la page produit
      cy.visit(`/products/${product.id}`);
      cy.wait(500);

      // Récupérer la quantité indiquée par l'utilisateur
      cy.get('[data-cy="detail-product-quantity"]')
        .invoke("val")
        .then((quantity) => {
          const quantityToAdd = parseInt(quantity, 10);

          // Vérifier que le bouton "Ajouter au panier" est cliquable
          cy.get('[data-cy="detail-product-add"]').should("not.be.disabled"); // Vérifie que le bouton est actif
          cy.get('[data-cy="detail-product-add"]').click();

          // Vérifier que le produit apparaît dans le panier
          cy.get('[data-cy="nav-link-cart"]').click();
          cy.get('[data-cy="cart-line-name"]', { timeout: 10000 })
            .should("exist")
            .and("contain", product.name); // Vérifie que le nom du produit est dans le panier

          // Requête pour vérifier que le stock a été mis à jour
          cy.request({
            method: "GET",
            url: `${Cypress.env("apiUrl")}/products/${product.id}`, // Endpoint pour un produit spécifique
          }).then((updatedResponse) => {
            const updatedStock = updatedResponse.body.availableStock;
            cy.log(
              `Stock initial : ${initialStock}, Stock mis à jour : ${updatedStock}`
            );
            expect(updatedStock).to.equal(initialStock - quantityToAdd); // Vérifie la diminution du stock
          });
        });
    });
  });

  it("Vider le panier", () => {
    cy.Login();
    cy.get('[data-cy="nav-link-cart"]').click();

    cy.get('[data-cy="cart-line-delete"]')
      .each(($el) => {
        cy.wrap($el)
          .click() // Clique sur l'icône de suppression
          .wait(500); // Attend un peu pour laisser la page se mettre à jour
      })
      .then(() => {
        // Vérifie que le panier est vide après avoir tout supprimé
        cy.get('[data-cy="cart-line-name"]').should("not.exist");
      });
  });
  it("Quantité négative", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/products`, // Vérifiez que cette URL est correcte
    }).then((response) => {
      // Récupérer uniquement l'ID du premier produit en stock
      const firstOnStockProductId = response.body.find(
        (product) => product.availableStock > 0
      )?.id; // Utiliser l'opérateur de chaîne optionnelle pour éviter les erreurs si aucun produit n'est trouvé

      if (!firstOnStockProductId) {
        throw new Error("Aucun produit en stock disponible");
      }

      cy.getAuthToken2().then((token) => {
        cy.request({
          method: "PUT",
          url: `${Cypress.env("apiUrl")}/orders/add`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            productId: firstOnStockProductId, // Utilisation de l'ID seulement
            quantity: -1,
          },
          failOnStatusCode: false, // Permet de gérer les statuts d'erreur sans échec automatique
        }).then((response) => {
          // Vérification du code de statut attendu
          expect(response.status).to.eq(400);
        });
      });
    });
  });
  it("Quantité 20 avec vérification de stock négatif", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.env("apiUrl")}/products`,
    }).then((response) => {
      const firstOnStockProduct = response.body.find(
        (product) => product.availableStock > 0
      );

      if (!firstOnStockProduct) {
        throw new Error("Aucun produit en stock disponible");
      }

      const { id: productId, availableStock: initialStock } =
        firstOnStockProduct;

      cy.getAuthToken2().then((token) => {
        cy.request({
          method: "PUT",
          url: `${Cypress.env("apiUrl")}/orders/add`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            product: productId,
            quantity: 20,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);

          // Vérification du stock après ajout
          cy.request({
            method: "GET",
            url: `${Cypress.env("apiUrl")}/products/${productId}`,
          }).then((productResponse) => {
            const updatedStock = productResponse.body.availableStock;

            // Vérification si le stock est devenu négatif
            expect(updatedStock).to.be.at.least(
              0,
              "Le stock ne doit pas être négatif"
            );
            expect(updatedStock).to.eq(
              initialStock - 20,
              "Le stock devrait être correctement décrémenté"
            );
          });
        });
      });
    });
  });
});
