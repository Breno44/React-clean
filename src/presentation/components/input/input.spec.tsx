import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from "@testing-library/react";
import React from "react";
import Input from "./input";
import Context from "@/presentation/contexts/form/form-context";
import faker from "faker";

const makeSut = (fieldName: string): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} }}>
      <Input name={fieldName} />
    </Context.Provider>
  );
};

describe("Input component", () => {
  test("Should begin with readOnly", () => {
    const field = faker.database.column();
    makeSut(field);
    const input = screen.getByRole(field) as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  test("Should remove readOnly on focus", () => {
    const field = faker.database.column();
    makeSut(field);
    const input = screen.getByRole(field) as HTMLInputElement;
    fireEvent.focus(input);
    expect(input.readOnly).toBe(false);
  });

  test("Should focus input on label click", () => {
    const field = faker.database.column();
    makeSut(field);
    const input = screen.getByRole(field);
    const label = screen.getByRole(`${field}-label`);
    fireEvent.click(label);
    expect(document.activeElement).toBe(input);
  });
});
