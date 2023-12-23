export const addComment = (commentText) => {
  cy.scrollTo("bottom");

  cy.get(".comment-textarea").first().type(commentText);
  cy.get("button").contains("Send").click();

  cy.contains(commentText).should("be.visible");
};

export const editComment = (originalText, newText) => {
  cy.contains(originalText)
    .parents(".card")
    .within(() => {
      cy.get(".edit").first().click();
    });

  cy.get(".comment-box")
    .first()
    .should("be.visible")
    .within(() => {
      cy.get(".comment-textarea").clear().type(newText);
    });

  cy.get(".action-button").contains("Done").click();
  cy.contains(newText).should("be.visible");
};

export const deleteComment = (commentText) => {
  cy.contains(commentText)
    .parents(".card")
    .within(() => {
      cy.get(".delete").first().click();
    });

  cy.get(".modal-overlay").should("be.visible");

  cy.wait(500);

  cy.get(".button-danger").should("be.visible").click({ force: true });
};
