describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Should load with correct initial state", () => {
    cy.getByRole("email-status")
      .should("have.attr", "title", "Campo obrigatório")
      .should("contain.text", "🔴");
    cy.getByRole("password-status")
      .should("have.attr", "title", "Campo obrigatório")
      .should("contain.text", "🔴");
    cy.getByRole("submit").should("have.attr", "disabled");
    cy.getByRole("error-wrap").should("not.have.descendants");
  });
});
