import React from "react";
import faker from "faker";
import {
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from "@testing-library/react";
import { Login } from "@/presentation/pages";
import {
  ValidationStub,
  AuthenticationSpy,
  SaveAccessTokenMock,
  Helper,
} from "@/presentation/test";
import { createMemoryHistory } from "@remix-run/router";
import { Router } from "react-router-dom";

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
  saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ["/login"] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const authenticationSpy = new AuthenticationSpy();
  const saveAccessTokenMock = new SaveAccessTokenMock();
  const sut = render(
    <Router location={history.location} navigator={history}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  );
  return {
    sut,
    authenticationSpy,
    saveAccessTokenMock,
  };
};

const simulateValidSubmit = async (
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  populateEmailField(email);
  populatePasswordField(password);
  const form = screen.getByRole("form");
  fireEvent.submit(form);
  await waitFor(() => form);
};

const populateEmailField = (email = faker.internet.email()): void => {
  const emailInput = screen.getByRole("email");
  fireEvent.input(emailInput, {
    target: { value: email },
  });
};

const populatePasswordField = (password = faker.internet.password()): void => {
  const passwordInput = screen.getByRole("password");
  fireEvent.input(passwordInput, {
    target: { value: password },
  });
};

const testElementsExists = (fieldName: string): void => {
  const el = screen.getByRole(fieldName);
  expect(el).toBeTruthy();
};

describe("Login Component", () => {
  test("Should start with initial state", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    Helper.testChildCount("error-wrap", 0);
    Helper.testButtonIsDisabled("submit", true);
    Helper.testStatusForField("email", validationError);
    Helper.testStatusForField("password", validationError);
  });

  test("Should show email error if Validation fails", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    populateEmailField();
    Helper.testStatusForField("email", validationError);
  });

  test("Should show password error if Validation fails", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    populatePasswordField();
    Helper.testStatusForField("password", validationError);
  });

  test("Should show valid email state if Validation succeeds", () => {
    makeSut();
    populateEmailField();
    Helper.testStatusForField("email");
  });

  test("Should show valid password state if Validation succeeds", () => {
    makeSut();
    populatePasswordField();
    Helper.testStatusForField("password");
  });

  test("Should enable submit button if form is valid", () => {
    makeSut();
    populateEmailField();
    populatePasswordField();
    Helper.testButtonIsDisabled("submit", false);
  });

  test("Should show spinner on submit", async () => {
    makeSut();
    await simulateValidSubmit();
    testElementsExists("spinner");
  });

  test("Should call Authentication with correct values", async () => {
    const { authenticationSpy } = makeSut();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await simulateValidSubmit(email, password);
    expect(authenticationSpy.params).toEqual({
      email,
      password,
    });
  });

  test("Should call Authentication only once", async () => {
    const { authenticationSpy } = makeSut();
    await simulateValidSubmit();
    await simulateValidSubmit();
    expect(authenticationSpy.callsCount).toBe(1);
  });

  test("Should not call Authentication if form is invalid", async () => {
    const validationError = faker.random.words();
    const { authenticationSpy } = makeSut({ validationError });
    await simulateValidSubmit();
    expect(authenticationSpy.callsCount).toBe(0);
  });

  test("Should call SaveAccessToken on success", async () => {
    const { authenticationSpy, saveAccessTokenMock } = makeSut();
    await simulateValidSubmit();
    expect(saveAccessTokenMock.accessToken).toBe(
      authenticationSpy.account.accessToken
    );
    expect(history.location.pathname).toBe("/");
  });

  it("Should go to signup page", async () => {
    makeSut();
    const register = screen.getByRole("signup");
    fireEvent.click(register);
    expect(history.location.pathname).toBe("/signup");
    expect(history.index).toBe(1);
  });
});
