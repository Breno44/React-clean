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

const populateField = (
  fieldName: string,
  value = faker.random.word()
): void => {
  const el = screen.getByRole(fieldName);
  fireEvent.input(el, {
    target: { value: value },
  });
};

describe("Login Component", () => {
  test("Should start with initial state", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    Helper.testChildCount("error-wrap", 0);
    Helper.testButtonIsDisabled("submit", true);
    Helper.testStatusForField("name", validationError);
    Helper.testStatusForField("email", "Campo obrigatório");
    Helper.testStatusForField("password", "Campo obrigatório");
    Helper.testStatusForField("passwordConfirmation", "Campo obrigatório");
  });

  test("Should show name error if Validation fails", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    populateField("name");
    Helper.testStatusForField("name", validationError);
  });
});
