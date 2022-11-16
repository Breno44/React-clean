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

  it("Should present InvalidCredentialsError", () => {
    cy.intercept("POST", /login/, {
      statusCode: 401,
      body: {},
    });
    cy.getByRole("email").focus().type(faker.internet.email());
    cy.getByRole("password").focus().type(faker.random.alphaNumeric(5));
    cy.getByRole("submit").click();
    cy.getByRole("spinner").should("not.exist");
    cy.getByRole("main-error").should("contain.text", "Credenciais inválidas");
    cy.url().should("equal", `${baseUrl}/login`);
  });

  it("Should present UnexpectedError", () => {
    cy.intercept("POST", /login/, {
      statusCode: 400,
      body: {},
    });
    cy.getByRole("email").focus().type(faker.internet.email());
    cy.getByRole("password").focus().type(faker.random.alphaNumeric(5));
    cy.getByRole("submit").click();
    cy.getByRole("spinner").should("not.exist");
    cy.getByRole("main-error").should(
      "contain.text",
      "Algo de errado aconteceu. Tente novamente em breve"
    );
    cy.url().should("equal", `${baseUrl}/login`);
  });

  it("Should present save accessToken if valid credentials are provided", () => {
    cy.intercept("POST", /login/, {
      statusCode: 200,
      body: {
        accessToken: faker.random.uuid(),
      },
    });
    cy.getByRole("email").focus().type(faker.internet.email());
    cy.getByRole("password").focus().type(faker.random.alphaNumeric(5));
    cy.getByRole("submit").click();
    cy.getByRole("main-error").should("not.exist");
    cy.getByRole("spinner").should("not.exist");
    cy.url().should("equal", `${baseUrl}/`);
    cy.window().should((window) =>
      assert.isOk(window.localStorage.getItem("accessToken"))
    );
  });

  it("Should present UnexpectedError if invalid data is returned", () => {
    cy.intercept("POST", /login/, {
      statusCode: 200,
      body: {
        invalidProperty: faker.random.uuid(),
      },
    });
    cy.getByRole("email").focus().type(faker.internet.email());
    cy.getByRole("password")
      .focus()
      .type(faker.random.alphaNumeric(5))
      .type("{enter}");
    cy.getByRole("spinner").should("not.exist");
    cy.getByRole("main-error").should(
      "contain.text",
      "Algo de errado aconteceu. Tente novamente em breve"
    );
    cy.url().should("equal", `${baseUrl}/login`);
  });

  it("Should prevent multiple submits", () => {
    cy.intercept("POST", /login/, {
      statusCode: 200,
      body: {
        invalidProperty: faker.random.uuid(),
      },
    }).as("request");
    cy.getByRole("email").focus().type(faker.internet.email());
    cy.getByRole("password").focus().type(faker.random.alphaNumeric(5));
    cy.getByRole("submit").dblclick();
    cy.get("@request.all").should("have.length", 1);
  });
});
