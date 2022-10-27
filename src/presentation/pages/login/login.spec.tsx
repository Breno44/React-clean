import React from "react";
import faker from "faker";
import "jest-localstorage-mock";
import {
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from "@testing-library/react";
import Login from "./login";
import { ValidationStub, AuthenticationSpy } from "@/presentation/test";
import { InvalidCredentialsError } from "@/domain/errors";
import { createMemoryHistory } from "@remix-run/router";
import { Router } from "react-router-dom";

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ["/login"] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  validationStub.errorMessage = params?.validationError;
  const sut = render(
    <Router location={history.location} navigator={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
  );
  return {
    sut,
    authenticationSpy,
  };
};

const simulateValidSubmit = (
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  populateEmailField(email);
  populatePasswordField(password);
  const submitButton = screen.getByRole("submit");
  fireEvent.click(submitButton);
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

const simulateStatusForField = (
  fieldName: string,
  validationError?: string
): void => {
  const emailStatus = screen.getByRole(`${fieldName}-status`);
  expect(emailStatus.title).toBe(validationError || "Tudo certo!");
  expect(emailStatus.textContent).toBe(validationError ? "🔴" : "🟢");
};

describe("Login Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Should start with initial state", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    const errorWrap = screen.getByRole("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);
    const submitButton = screen.getByRole("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    simulateStatusForField("email", validationError);
    simulateStatusForField("password", validationError);
  });

  test("Should show email error if Validation fails", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    populateEmailField();
    simulateStatusForField("email", validationError);
  });

  test("Should show password error if Validation fails", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    populatePasswordField();
    simulateStatusForField("password", validationError);
  });

  test("Should show valid email state if Validation succeeds", () => {
    makeSut();
    populateEmailField();
    simulateStatusForField("email");
  });

  test("Should show valid password state if Validation succeeds", () => {
    makeSut();
    populatePasswordField();
    simulateStatusForField("password");
  });

  test("Should enable submit button if form is valid", () => {
    makeSut();
    populateEmailField();
    populatePasswordField();
    const submitButton = screen.getByRole("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  test("Should show spinner on submit", () => {
    makeSut();
    simulateValidSubmit();
    const spinner = screen.getByRole("spinner");
    expect(spinner).toBeTruthy();
  });

  test("Should call Authentication with correct values", () => {
    const { authenticationSpy } = makeSut();
    const email = faker.internet.email();
    const password = faker.internet.password();
    simulateValidSubmit(email, password);
    expect(authenticationSpy.params).toEqual({
      email,
      password,
    });
  });

  test("Should call Authentication only once", () => {
    const { authenticationSpy } = makeSut();
    simulateValidSubmit();
    simulateValidSubmit();
    expect(authenticationSpy.callsCount).toBe(1);
  });

  test("Should not call Authentication if form is invalid", () => {
    const validationError = faker.random.words();
    const { authenticationSpy } = makeSut({ validationError });
    populateEmailField();
    fireEvent.submit(screen.getByRole("form"));
    expect(authenticationSpy.callsCount).toBe(1);
  });

  test("Should present error if Authentication fails", () => {
    const { authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(authenticationSpy, "auth").mockRejectedValueOnce(error);
    populateEmailField();
    const mainError = screen.getByRole("main-error");
    expect(mainError.textContent).toBe(error.message);
    const errorWrap = screen.getByRole("error-wrap");
    expect(errorWrap.childElementCount).toBe(1);
  });

  test("Should add accessToken to localStorage on success", async () => {
    const { authenticationSpy } = makeSut();
    simulateValidSubmit();
    await waitFor(() => screen.getByRole("form"));
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      authenticationSpy.account.accessToken
    );
    expect(history.location.pathname).toBe("/");
  });

  it("Should go to signup page", async () => {
    makeSut();
    const register = screen.getByTestId("signup");
    fireEvent.click(register);
    expect(history.location.pathname).toBe("/signup");
    expect(history.index).toBe(1);
  });
});
