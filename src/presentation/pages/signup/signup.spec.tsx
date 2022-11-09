import React from "react";
import SignUp from "./signup";
import {
  RenderResult,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import {
  Helper,
  ValidationStub,
  AddAccountSpy,
  SaveAccessTokenMock,
} from "@/presentation/test";
import { createMemoryHistory } from "@remix-run/router";
import { Router } from "react-router-dom";
import faker from "faker";

type SutTypes = {
  sut: RenderResult;
  addAccountSpy: AddAccountSpy;
  saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ["/signup"] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const addAccountSpy = new AddAccountSpy();
  const saveAccessTokenMock = new SaveAccessTokenMock();
  const sut = render(
    <Router location={history.location} navigator={history}>
      <SignUp
        validation={validationStub}
        addAccount={addAccountSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  );
  return {
    sut,
    addAccountSpy,
    saveAccessTokenMock,
  };
};

const simulateValidSubmit = async (
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password()
): Promise<void> => {
  Helper.populateField("name", name);
  Helper.populateField("email", email);
  Helper.populateField("password", password);
  Helper.populateField("passwordConfirmation", password);
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
    Helper.testStatusForField("name", validationError);
    Helper.testStatusForField("email", validationError);
    Helper.testStatusForField("password", validationError);
    Helper.testStatusForField("passwordConfirmation", validationError);
  });

  test("Should show name error if Validation fails", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    Helper.populateField("name");
    Helper.testStatusForField("name", validationError);
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

  test("Should show passwordConfirmation error if Validation fails", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    Helper.populateField("passwordConfirmation");
    Helper.testStatusForField("passwordConfirmation", validationError);
  });

  test("Should show valid name state if Validation succeeds", () => {
    makeSut();
    Helper.populateField("name");
    Helper.testStatusForField("name");
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

  test("Should show valid passwordConfirmation state if Validation succeeds", () => {
    makeSut();
    Helper.populateField("passwordConfirmation");
    Helper.testStatusForField("passwordConfirmation");
  });

  test("Should enable submit button if form is valid", () => {
    makeSut();
    Helper.populateField("name");
    Helper.populateField("email");
    Helper.populateField("password");
    Helper.populateField("passwordConfirmation");
    Helper.testButtonIsDisabled("submit", false);
  });

  test("Should show spinner on submit", async () => {
    makeSut();
    await simulateValidSubmit();
    Helper.testElementsExists("spinner");
  });

  test("Should call AddAccount with correct values", async () => {
    const { addAccountSpy } = makeSut();
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await simulateValidSubmit(name, email, password);
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password,
    });
  });

  test("Should call AddAccount only once", async () => {
    const { addAccountSpy } = makeSut();
    await simulateValidSubmit();
    await simulateValidSubmit();
    expect(addAccountSpy.callsCount).toBe(1);
  });

  test("Should not call AddAccount if form is invalid", async () => {
    const validationError = faker.random.words();
    const { addAccountSpy } = makeSut({ validationError });
    await simulateValidSubmit();
    expect(addAccountSpy.callsCount).toBe(0);
  });

  test("Should call SaveAccessToken on success", async () => {
    const { addAccountSpy, saveAccessTokenMock } = makeSut();
    await simulateValidSubmit();
    expect(saveAccessTokenMock.accessToken).toBe(
      addAccountSpy.account.accessToken
    );
    expect(history.location.pathname).toBe("/");
  });
});
