import React from "react";
import Login from "./login";
import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from "@testing-library/react";
import { ValidationSpy } from "@/presentation/test";
import faker from "faker";

type SutTypes = {
  sut: RenderResult;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  validationSpy.errorMessage = faker.random.words();
  const sut = render(<Login validation={validationSpy} />);

  return {
    sut,
    validationSpy,
  };
};

describe("Login Component", () => {
  test("Should not render spinner and error on start", () => {
    const { validationSpy } = makeSut();
    const errorWrap = screen.getByRole("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);
    const submitButton = screen.getByRole("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    const emailStatus = screen.getByRole("email-status");
    expect(emailStatus.title).toBe(validationSpy.errorMessage);
    expect(emailStatus.textContent).toBe("🔴");
    const passwordStatus = screen.getByRole("password-status");
    expect(passwordStatus.title).toBe("Campo obrigatório");
    expect(passwordStatus.textContent).toBe("🔴");
  });

  test("Should call Validation with correct email", () => {
    const { validationSpy } = makeSut();
    const emailInput = screen.getByRole("email");
    const email = faker.internet.email();
    fireEvent.input(emailInput, { target: { value: email } });
    expect(validationSpy.fieldName).toEqual("email");
    expect(validationSpy.fieldValue).toEqual(email);
  });

  test("Should call Validation with correct password", () => {
    const { validationSpy } = makeSut();
    const passwordInput = screen.getByRole("password");
    const password = faker.internet.password();
    fireEvent.input(passwordInput, { target: { value: password } });
    expect(validationSpy.fieldName).toEqual("password");
    expect(validationSpy.fieldValue).toEqual(password);
  });

  test("Should show email error if Validation fails", () => {
    const { sut, validationSpy } = makeSut();
    const emailInput = screen.getByRole("email");
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    const emailStatus = sut.getByRole("email-status");
    expect(emailStatus.title).toBe(validationSpy.errorMessage);
    expect(emailStatus.textContent).toBe("🔴");
  });
});
