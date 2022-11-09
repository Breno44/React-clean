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
  Helper.populateField("email", email);
  Helper.populateField("password", password);
  const form = screen.getByRole("form");
  fireEvent.submit(form);
  await waitFor(() => form);
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
    Helper.populateField("email");
    Helper.testStatusForField("email", validationError);
  });

  test("Should show password error if Validation fails", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    Helper.populateField("password");
    Helper.testStatusForField("password", validationError);
  });

  test("Should show valid email state if Validation succeeds", () => {
    makeSut();
    Helper.populateField("email");
    Helper.testStatusForField("email");
  });

  test("Should show valid password state if Validation succeeds", () => {
    makeSut();
    Helper.populateField("password");
    Helper.testStatusForField("password");
  });

  test("Should enable submit button if form is valid", () => {
    makeSut();
    Helper.populateField("email");
    Helper.populateField("password");
    Helper.testButtonIsDisabled("submit", false);
  });

  test("Should show spinner on submit", async () => {
    makeSut();
    await simulateValidSubmit();
    Helper.testElementsExists("spinner");
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
    const register = screen.getByRole("signup-link");
    fireEvent.click(register);
    expect(history.location.pathname).toBe("/signup");
    expect(history.index).toBe(1);
  });
});
