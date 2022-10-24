import React from "react";
import Login from "./login";
import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from "@testing-library/react";
import { ValidationStub } from "@/presentation/test";
import faker from "faker";

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
};

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = faker.random.words();
  const sut = render(<Login validation={validationStub} />);

  return {
    sut,
    validationStub,
  };
};

describe("Login Component", () => {
  test("Should not render spinner and error on start", () => {
    const { validationStub } = makeSut();
    const errorWrap = screen.getByRole("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);
    const submitButton = screen.getByRole("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    const emailStatus = screen.getByRole("email-status");
    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe("🔴");
    const passwordStatus = screen.getByRole("password-status");
    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe("🔴");
  });

  test("Should show email error if Validation fails", () => {
    const { sut, validationStub } = makeSut();
    const emailInput = screen.getByRole("email");
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    const emailStatus = sut.getByRole("email-status");
    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe("🔴");
  });

  test("Should show password error if Validation fails", () => {
    const { sut, validationStub } = makeSut();
    const passwordInput = screen.getByRole("password");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });
    const passwordStatus = sut.getByRole("password-status");
    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe("🔴");
  });
});
