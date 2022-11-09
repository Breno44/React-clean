import React from "react";
import SignUp from "./signup";
import {
  RenderResult,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Helper, ValidationStub } from "@/presentation/test";
import faker from "faker";

type SutTypes = {
  sut: RenderResult;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const sut = render(<SignUp validation={validationStub} />);
  return {
    sut,
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
    testElementsExists("spinner");
  });
});
