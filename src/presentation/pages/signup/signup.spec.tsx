import React from "react";
import SignUp from "./signup";
import { RenderResult, render, screen } from "@testing-library/react";

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<SignUp />);
  return {
    sut,
  };
};

const testChildCount = (fieldName: string, count: number): void => {
  const el = screen.getByRole(fieldName);
  expect(el.childElementCount).toBe(count);
};

const testButtonIsDisabled = (fieldName: string, isDisabled: boolean): void => {
  const button = screen.getByRole(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

const testStatusForField = (
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = screen.getByRole(`${fieldName}-status`);
  expect(fieldStatus.title).toBe(validationError || "Tudo certo!");
  expect(fieldStatus.textContent).toBe(validationError ? "🔴" : "🟢");
};

describe("Login Component", () => {
  test("Should start with initial state", () => {
    const validationError = "Campo obrigatório";
    makeSut();
    testChildCount("error-wrap", 0);
    testButtonIsDisabled("submit", true);
    testStatusForField("name", validationError);
    testStatusForField("email", validationError);
    testStatusForField("password", validationError);
    testStatusForField("passwordConfirmation", validationError);
  });
});
