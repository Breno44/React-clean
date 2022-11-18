import faker from "faker";
import * as FormHelper from "../support/form-helper";
import * as Http from "../support/signup-mocks";

const populateFields = (): void => {
  const password = faker.random.alphaNumeric(7);

  cy.getByRole("name").focus().type(faker.name.findName());
  cy.getByRole("email").focus().type(faker.internet.email());
  cy.getByRole("password").focus().type(password);
  cy.getByRole("passwordConfirmation").focus().type(password);
};

const simulateValidSubmit = (): void => {
  populateFields();
  cy.getByRole("submit").click();
};

describe("SignUp", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("Should load with correct initial state", () => {
    cy.getByRole("name").should("have.attr", "readOnly");
    FormHelper.testInputStatus("name", "Campo obrigatório");
    cy.getByRole("email").should("have.attr", "readOnly");
    FormHelper.testInputStatus("email", "Campo obrigatório");
    cy.getByRole("password").should("have.attr", "readOnly");
    FormHelper.testInputStatus("password", "Campo obrigatório");
    cy.getByRole("passwordConfirmation").should("have.attr", "readOnly");
    FormHelper.testInputStatus("passwordConfirmation", "Campo obrigatório");
    cy.getByRole("submit").should("have.attr", "disabled");
    cy.getByRole("error-wrap").should("not.have.descendants");
  });

  it("Should present error state if form is invalid", () => {
    cy.getByRole("name").focus().type(faker.random.alphaNumeric(3));
    FormHelper.testInputStatus("name", "Valor inválido");
    cy.getByRole("email").focus().type(faker.random.word());
    FormHelper.testInputStatus("email", "Valor inválido");
    cy.getByRole("password").focus().type(faker.random.alphaNumeric(3));
    FormHelper.testInputStatus("password", "Valor inválido");
    cy.getByRole("passwordConfirmation")
      .focus()
      .type(faker.random.alphaNumeric(4));
    FormHelper.testInputStatus("passwordConfirmation", "Valor inválido");
    cy.getByRole("submit").should("have.attr", "disabled");
    cy.getByRole("error-wrap").should("not.have.descendants");
  });

  it("Should present valid state if form is valid", () => {
    const password = faker.random.alphaNumeric(5);
    cy.getByRole("name").focus().type(faker.name.findName());
    FormHelper.testInputStatus("name");
    cy.getByRole("email").focus().type(faker.internet.email());
    FormHelper.testInputStatus("email");
    cy.getByRole("password").focus().type(password);
    FormHelper.testInputStatus("password");
    cy.getByRole("passwordConfirmation").focus().type(password);
    FormHelper.testInputStatus("passwordConfirmation");
    cy.getByRole("submit").should("not.have.attr", "disabled");
    cy.getByRole("error-wrap").should("not.have.descendants");
  });

  it("Should present EmailInUse", () => {
    Http.mockEmailInUse();
    simulateValidSubmit();
    FormHelper.testMainError("Esse e-mail já está em uso");
    FormHelper.testUrl("/signup");
  });

  it("Should present UnexpectedError", () => {
    Http.mockUnexpectedError();
    simulateValidSubmit();
    FormHelper.testMainError(
      "Algo de errado aconteceu. Tente novamente em breve"
    );
    FormHelper.testUrl("/signup");
  });

  it("Should present save accessToken if valid credentials are provided", () => {
    Http.mockOk();
    simulateValidSubmit();
    cy.getByRole("error-wrap").should("not.have.descendants");
    FormHelper.testUrl("/");
    FormHelper.testLocalStorageItem("accessToken");
  });

  it("Should present UnexpectedError if invalid data is returned", () => {
    Http.mockInvalidData();
    simulateValidSubmit();
    FormHelper.testMainError(
      "Algo de errado aconteceu. Tente novamente em breve"
    );
    FormHelper.testUrl("/signup");
  });

  it("Should prevent multiple submits", () => {
    Http.mockOk();
    populateFields();
    cy.getByRole("submit").dblclick();
    FormHelper.testHttpCallsCount(1);
  });

  it("Should not call submit if form is invalid", () => {
    Http.mockOk();
    cy.getByRole("email").focus().type(faker.internet.email()).type("{enter}");
    FormHelper.testHttpCallsCount(0);
  });
});
