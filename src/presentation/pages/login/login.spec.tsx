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

const testStatusForField = (
  fieldName: string,
  validationError?: string
): void => {
  const emailStatus = screen.getByRole(`${fieldName}-status`);
  expect(emailStatus.title).toBe(validationError || "Tudo certo!");
  expect(emailStatus.textContent).toBe(validationError ? "🔴" : "🟢");
};

const testErrorWrapChildCount = (count: number): void => {
  const errorWrap = screen.getByRole("error-wrap");
  expect(errorWrap.childElementCount).toBe(count);
};

const testElementsExists = (fieldName: string): void => {
  const el = screen.getByRole(fieldName);
  expect(el).toBeTruthy();
};

describe("Login Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Should start with initial state", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    testErrorWrapChildCount(0);
    const submitButton = screen.getByRole("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    testStatusForField("email", validationError);
    testStatusForField("password", validationError);
  });

  test("Should show email error if Validation fails", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    populateEmailField();
    testStatusForField("email", validationError);
  });

  test("Should show password error if Validation fails", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    populatePasswordField();
    testStatusForField("password", validationError);
  });

  test("Should show valid email state if Validation succeeds", () => {
    makeSut();
    populateEmailField();
    testStatusForField("email");
  });

  test("Should show valid password state if Validation succeeds", () => {
    makeSut();
    populatePasswordField();
    testStatusForField("password");
  });

  test("Should enable submit button if form is valid", () => {
    makeSut();
    populateEmailField();
    populatePasswordField();
    const submitButton = screen.getByRole("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
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
    expect(authenticationSpy.callsCount).toBe(1);
  });

  test("Should present error if Authentication fails", () => {
    const { authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    jest.spyOn(authenticationSpy, "auth").mockRejectedValueOnce(error);
    populateEmailField();
    const mainError = screen.getByRole("main-error");
    expect(mainError.textContent).toBe(error.message);
    testErrorWrapChildCount(1);
  });

  test("Should add accessToken to localStorage on success", async () => {
    const { authenticationSpy } = makeSut();
    await simulateValidSubmit();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
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
