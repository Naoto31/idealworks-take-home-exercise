import * as commentActions from "./commentActions";

describe("HomePage Tests", () => {
  const text = "This is a new comment";
  const editedText = "This is an edited comment";
  it("successfully loads and complete CRUD actions", () => {
    cy.visit("http://localhost:8080");
    cy.get(".container").should("be.visible");
    cy.get(".card").should("have.length.at.least", 1);
    commentActions.addComment(text);
    commentActions.editComment(text, editedText);
    commentActions.deleteComment(editedText);
  });
});
