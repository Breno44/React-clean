import React from "react";
import SignUp from "./signup";
import {
  RenderResult,
  render,
  screen,
  fireEvent,
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
});
