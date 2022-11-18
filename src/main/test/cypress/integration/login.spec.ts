import faker from "faker";
import * as FormHelper from "../support/form-helper";
import * as Helper from "../support/login-mocks";

const simulateValidSubmit = (): void => {
  cy.getByRole("email").focus().type(faker.internet.email());
  cy.getByRole("password").focus().type(faker.random.alphaNumeric(5));
  cy.getByRole("submit").click();
};

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("Should load with correct initial state", () => {
    cy.getByRole("email").should("have.attr", "readOnly");
    FormHelper.testInputStatus("email", "Campo obrigatório");
    cy.getByRole("password").should("have.attr", "readOnly");
    FormHelper.testInputStatus("password", "Campo obrigatório");
    cy.getByRole("submit").should("have.attr", "disabled");
    cy.getByRole("error-wrap").should("not.have.descendants");
  });

  it("Should present error state if form is invalid", () => {
    cy.getByRole("email").focus().type(faker.random.word());
    FormHelper.testInputStatus("email", "Valor inválido");
    cy.getByRole("password").focus().type(faker.random.alphaNumeric(3));
    FormHelper.testInputStatus("password", "Valor inválido");
    cy.getByRole("submit").should("have.attr", "disabled");
    cy.getByRole("error-wrap").should("not.have.descendants");
  });

  it("Should present valid state if form is valid", () => {
    cy.getByRole("email").focus().type(faker.internet.email());
    FormHelper.testInputStatus("email");
    cy.getByRole("password").focus().type(faker.random.alphaNumeric(5));
    FormHelper.testInputStatus("password");
    cy.getByRole("submit").should("not.have.attr", "disabled");
    cy.getByRole("error-wrap").should("not.have.descendants");
  });

  it("Should present InvalidCredentialsError", () => {
    Helper.mockInvalidCredentialsError();
    cy.getByRole("email").focus().type(faker.internet.email());
    cy.getByRole("password").focus().type(faker.random.alphaNumeric(5));
    cy.getByRole("submit").click();
    FormHelper.testMainError("Credenciais inválidas");
    FormHelper.testUrl("/login");
  });

  it("Should present UnexpectedError", () => {
    Helper.mockUnexpectedError();
    simulateValidSubmit();
    FormHelper.testMainError(
      "Algo de errado aconteceu. Tente novamente em breve"
    );
    FormHelper.testUrl("/login");
  });

  it("Should present save accessToken if valid credentials are provided", () => {
    Helper.mockOk();
    simulateValidSubmit();
    cy.getByRole("error-wrap").should("not.have.descendants");
    FormHelper.testUrl("/");
    FormHelper.testLocalStorageItem("accessToken");
  });

  it("Should present UnexpectedError if invalid data is returned", () => {
    Helper.mockInvalidData();
    simulateValidSubmit();
    FormHelper.testMainError(
      "Algo de errado aconteceu. Tente novamente em breve"
    );
    FormHelper.testUrl("/login");
  });

  it("Should prevent multiple submits", () => {
    Helper.mockOk();
    cy.getByRole("email").focus().type(faker.internet.email());
    cy.getByRole("password").focus().type(faker.random.alphaNumeric(5));
    cy.getByRole("submit").dblclick();
    FormHelper.testHttpCallsCount(1);
  });

  it("Should not call submit if form is invalid", () => {
    Helper.mockOk();
    cy.getByRole("email").focus().type(faker.internet.email()).type("{enter}");
    FormHelper.testHttpCallsCount(0);
  });
});
