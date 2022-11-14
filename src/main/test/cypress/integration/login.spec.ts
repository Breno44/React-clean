import faker from "faker";

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Should load with correct initial state", () => {
    cy.getByRole("email").should("have.attr", "readOnly");
    cy.getByRole("email-status")
      .should("have.attr", "title", "Campo obrigatório")
      .should("contain.text", "🔴");
    cy.getByRole("password").should("have.attr", "readOnly");
    cy.getByRole("password-status")
      .should("have.attr", "title", "Campo obrigatório")
      .should("contain.text", "🔴");
    cy.getByRole("submit").should("have.attr", "disabled");
    cy.getByRole("error-wrap").should("not.have.descendants");
  });

  it("Should present error state if form is invalid", () => {
    cy.getByRole("email").focus().type(faker.random.word());
    cy.getByRole("email-status")
      .should("have.attr", "title", "Valor inválido")
      .should("contain.text", "🔴");
    cy.getByRole("password").focus().type(faker.random.alphaNumeric(3));
    cy.getByRole("password-status")
      .should("have.attr", "title", "Valor inválido")
      .should("contain.text", "🔴");
    cy.getByRole("submit").should("have.attr", "disabled");
    cy.getByRole("error-wrap").should("not.have.descendants");
  });

  it("Should present valid state if form is valid", () => {
    cy.getByRole("email").focus().type(faker.internet.email());
    cy.getByRole("email-status")
      .should("have.attr", "title", "Tudo certo!")
      .should("contain.text", "🟢");
    cy.getByRole("password").focus().type(faker.random.alphaNumeric(5));
    cy.getByRole("password-status")
      .should("have.attr", "title", "Tudo certo!")
      .should("contain.text", "🟢");
    cy.getByRole("submit").should("not.have.attr", "disabled");
    cy.getByRole("error-wrap").should("not.have.descendants");
  });
});
