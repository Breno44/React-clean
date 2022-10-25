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
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const sut = render(<Login validation={validationStub} />);

  return {
    sut,
  };
};

describe("Login Component", () => {
  test("Should not render spinner and error on start", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    const errorWrap = screen.getByRole("error-wrap");
    expect(errorWrap.childElementCount).toBe(0);
    const submitButton = screen.getByRole("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    const emailStatus = screen.getByRole("email-status");
    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe("🔴");
    const passwordStatus = screen.getByRole("password-status");
    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe("🔴");
  });

  test("Should show email error if Validation fails", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    const emailInput = screen.getByRole("email");
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    const emailStatus = screen.getByRole("email-status");
    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe("🔴");
  });

  test("Should show password error if Validation fails", () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    const passwordInput = screen.getByRole("password");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });
    const passwordStatus = screen.getByRole("password-status");
    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe("🔴");
  });

  test("Should show valid email state if Validation succeeds", () => {
    makeSut();
    const emailInput = screen.getByRole("email");
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    });
    const emailStatus = screen.getByRole("email-status");
    expect(emailStatus.title).toBe("Tudo certo!");
    expect(emailStatus.textContent).toBe("🟢");
  });

  test("Should show valid password state if Validation succeeds", () => {
    makeSut();
    const passwordInput = screen.getByRole("password");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });
    const passwordStatus = screen.getByRole("password-status");
    expect(passwordStatus.title).toBe("Tudo certo!");
    expect(passwordStatus.textContent).toBe("🟢");
  });

  test("Should enable submit button if form is valid", () => {
    makeSut();
    const emailInput = screen.getByRole("email");
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    });
    const passwordInput = screen.getByRole("password");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });
    const submitButton = screen.getByRole("submit") as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  test("Should show spinner on submit", () => {
    makeSut();
    const emailInput = screen.getByRole("email");
    fireEvent.input(emailInput, {
      target: { value: faker.internet.email() },
    });
    const passwordInput = screen.getByRole("password");
    fireEvent.input(passwordInput, {
      target: { value: faker.internet.password() },
    });
    const submitButton = screen.getByRole("submit");
    fireEvent.click(submitButton);
    const spinner = screen.getByRole("spinner");
    expect(spinner).toBeTruthy();
  });
});
