import React from "react";
import Login from "./login";
import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from "@testing-library/react";
import { Validation } from "@/presentation/protocols/validation";

type SutTypes = {
  sut: RenderResult;
  validationSpy: ValidationSpy;
};

class ValidationSpy implements Validation {
  errorMessage: string;
  input: object;

  validate(input: object): string {
    this.input = input;
    return this.errorMessage;
  }
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const sut = render(<Login validation={validationSpy} />);

  return {
    sut,
    validationSpy,
  };
};

describe("Login Component", () => {
  test("Should not render spinner and error on start", () => {
    makeSut();
    const errorWrap = screen.getByRole("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);
    const submitButton = screen.getByRole("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    const emailStatus = screen.getByRole("email-status");
    expect(emailStatus.title).toBe("Campo obrigatório");
    expect(emailStatus.textContent).toBe("🔴");
    const passwordStatus = screen.getByRole("password-status");
    expect(passwordStatus.title).toBe("Campo obrigatório");
    expect(passwordStatus.textContent).toBe("🔴");
  });

  test("Should call Validation with correct email", () => {
    const { validationSpy } = makeSut();
    const emailInput = screen.getByRole("email");
    fireEvent.input(emailInput, { target: { value: "any_email" } });
    expect(validationSpy.input).toEqual({
      email: "any_email",
    });
  });

  test("Should call Validation with correct password", () => {
    const { validationSpy } = makeSut();
    const passwordInput = screen.getByRole("password");
    fireEvent.input(passwordInput, { target: { value: "any_password" } });
    expect(validationSpy.input).toEqual({
      password: "any_password",
    });
  });
});
