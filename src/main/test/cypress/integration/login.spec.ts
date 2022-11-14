import faker from "faker";

const baseUrl: string = Cypress.config().baseUrl;

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

  it("Should present valid state if form is valid", () => {
    cy.getByRole("email").focus().type(faker.internet.email());
    cy.getByRole("password").focus().type(faker.random.alphaNumeric(5));
    cy.getByRole("submit").click();
    cy.getByRole("error-wrap")
      .getByRole("spinner")
      .should("exist")
      .getByRole("main-error")
      .should("not.exist")
      .getByRole("spinner")
      .should("not.exist")
      .getByRole("main-error")
      .should("contain.text", "Credenciais inválidas");
    cy.url().should("equal", `${baseUrl}/login`);
  });

  it("Should present save accessToken if valid credentials are provided", () => {
    cy.getByRole("email").focus().type("mango@gmail.com");
    cy.getByRole("password").focus().type("12345");
    cy.getByRole("submit").click();
    cy.getByRole("error-wrap")
      .getByRole("spinner")
      .should("exist")
      .getByRole("main-error")
      .should("not.exist")
      .getByRole("spinner")
      .should("not.exist");
    cy.url().should("equal", `${baseUrl}/`);
    cy.window().should((window) =>
      assert.isOk(window.localStorage.getItem("accessToken"))
    );
  });
});
