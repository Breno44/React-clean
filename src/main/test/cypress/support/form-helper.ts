const baseUrl: string = Cypress.config().baseUrl;

export const testInputStatus = (field: string, error?: string): void => {
  cy.getByRole(`${field}-wrap`).should(
    "have.attr",
    "data-status",
    error ? "invalid" : "valid"
  );
  const attr = `${error ? "" : "not."}have.attr`;
  cy.getByRole(field).should(attr, "title", error);
  cy.getByRole(`${field}-label`).should(attr, "title", error);
};

export const testMainError = (error: string): void => {
  cy.getByRole("spinner").should("not.exist");
  cy.getByRole("main-error").should("contain.text", error);
};

export const testHttpCallsCount = (count: number): void => {
  cy.get("@request.all").should("have.length", count);
};

export const testUrl = (path: string): void => {
  cy.url().should("equal", `${baseUrl}${path}`);
};

export const testLocalStorageItem = (key: string): void => {
  cy.window().should((window) => assert.isOk(window.localStorage.getItem(key)));
};
