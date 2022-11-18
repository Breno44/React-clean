import faker from "faker";
import * as FormHelper from "../support/form-helper";

describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
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
});
