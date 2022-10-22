import React from "react";
import Login from "./login";
import { render, screen } from "@testing-library/react";

describe("Login Component", () => {
  test("Should not render spinner and error on start", () => {
    render(<Login />);
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
});
